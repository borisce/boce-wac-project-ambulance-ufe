import { Component, State, Host, h, Prop } from '@stencil/core';
import { AppointmentsListApiFactory, AppointmentsList} from '../../api/boce-wac-project-ambulance-wl';

@Component({
  tag: 'boce-wac-project-reserve-appointment',
  styleUrl: 'boce-wac-project-reserve-appointment.css',
  shadow: true,
})
export class BoceWacProjectReserveAppointment {
  @State() isLoggedOut: boolean = false;
  @State() isReserved: boolean = false;
  @State() isClosed: boolean = false;
  @State() nameInput: string [] = [];
  @State() reasonInput: string [] = [];
  @State() filteredTerms: AppointmentsList[] = [];
  @State() searchDate: string = '';
  @Prop() apiBase: string;
  @State() errorMessage: string;
  availableTerms: AppointmentsList[];
  private async getAppointmentsListAsync() {
    try {
      const response = await
        AppointmentsListApiFactory(undefined, this.apiBase).
          getAppointmentsList()
      if (response.status < 299) {
        return response.data;
      } else {
        this.errorMessage = `Cannot retrieve list of of available appointment slots: ${response.statusText}`
      }
    } catch (err: any) {
      this.errorMessage = `Cannot retrieve list of available appointment slots: ${err.message || "unknown"}`
    }
    return [];
  }
  async componentWillLoad() {
    this.availableTerms = await this.getAppointmentsListAsync();
    this.filteredTerms = this.availableTerms;

    const today = new Date().toISOString().split("T")[0];

    this.filteredTerms = this.availableTerms.filter(appointment => {
      return appointment.date > today && appointment.patientAppointed == false;
    });
  }
  private formatDate(date: Date): string {
    return new Intl.DateTimeFormat('sk-SK', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date);
  }
  private handleNameInput(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    this.nameInput = [...this.nameInput];
    this.nameInput[index] = input.value.trim();
  }
  
  private handleReasonInput(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    this.reasonInput = [...this.reasonInput];
    this.reasonInput[index] = input.value.trim();
  }
  private handleDateChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchDate = input.value;
    this.filterPatients();
  }
  private filterPatients() {
    this.filteredTerms = this.availableTerms.filter(patient => {
      const matchesDate = this.searchDate ? this.formatDate(new Date(patient.date)) === this.formatDate(new Date(this.searchDate)) : true;
      return matchesDate;
    });
  }

  private handleLogout(event: Event) {
    event.preventDefault();
    this.isLoggedOut = true;
  }

  private async handleReserve(event: Event, index: number) {
    event.preventDefault();
    const selectedTerm = this.filteredTerms[index];

    const updatedTerm: AppointmentsList = {
      id: selectedTerm.id,
      name: this.nameInput[index],
      date: selectedTerm.date,
      estimatedStart: selectedTerm.estimatedStart,
      estimatedEnd: selectedTerm.estimatedEnd,
      condition: this.reasonInput[index],
      doctorNote: selectedTerm.doctorNote,
      patientAppointed: true,
    };

    try {
      const response = await AppointmentsListApiFactory(undefined, this.apiBase).updateAppointment(updatedTerm);
      if (response.status < 299) {
        this.isReserved = true;
      } else {
        this.errorMessage = `Failed to reserve appointment: ${response.statusText}`;
      }
    } catch (error) {
      this.errorMessage = `Error reserving appointment: ${error.message}`;
    }
  }

  private handleClose(event: Event) {
    event.preventDefault();
    this.isClosed = true;
  }

  

  render() {
    if (this.isLoggedOut) {
      return (
          <boce-wac-project-login api-base={this.apiBase}></boce-wac-project-login>
      );
    }

    if (this.isReserved) {
      return (
          <boce-wac-project-my-appointments api-base={this.apiBase}></boce-wac-project-my-appointments>
      );
    }

    if (this.isClosed) {
      return (
          <boce-wac-project-my-appointments api-base={this.apiBase}></boce-wac-project-my-appointments>
      );
    }

    return (
      <Host>
        <div class="component-body">
          <header>
            <md-elevated-button onClick={(event) => this.handleLogout(event)}>Odhlásiť sa</md-elevated-button>
          </header>
          <h1>Objednanie sa na vyšetrenie</h1>
          <div class="filterflex">
            <div class="datepickerflex">
              <p class='headerinline'>Vyberte deň:</p>
              <input type="date" id="Test_DatetimeLocal" min={new Date().toISOString().split('T')[0]} value={this.searchDate} onInput={(event) => this.handleDateChange(event)} />
            </div>
          </div>
          {this.errorMessage
            ? <div class="error">{this.errorMessage}</div>
            :(
          <div>
            {this.filteredTerms.length === 0 ? (
            <p>Žiadne voľné termíny vyšetrení pre zvolený dátum.</p>
            ) : (
            <md-list class="patient-list">
              {this.filteredTerms.map((patient, index) =>
                <md-list-item>
                  <div slot="supporting-text">{"Termín vyšetrenia:" + this.formatDate(new Date(patient.date)) + " čas: " + patient.estimatedStart + " - " + patient.estimatedEnd}</div>
                  <input slot='end' type="text" placeholder='Zadajte meno a priezvisko' onInput={(event) => this.handleNameInput(event, index)} />
                  <input slot='end' type="text" placeholder='Zadajte dôvod vyšetrenia' onInput={(event) => this.handleReasonInput(event, index)} />
                  <md-elevated-button slot="end" disabled={!this.nameInput[index] || !this.reasonInput[index]} onClick={(event) => this.handleReserve(event, index)}>Rezervuj vyšetrenie</md-elevated-button>
                </md-list-item>
              )}
            </md-list>
            )}
          </div> )}  

          <div class="back-flex">
            <md-elevated-button onClick={(event) => this.handleClose(event)}>Späť</md-elevated-button>
          </div>
        </div>
      </Host>
    );
  }
}
