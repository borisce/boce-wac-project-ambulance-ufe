import { Component, State, Host, h } from '@stencil/core';

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
  @State() filteredPatients: any[] = [];
  @State() searchDate: string = '';
  waitingPatients: any[];
  private async getWaitingPatientsAsync() {
    return await Promise.resolve(
        [{
          name: '',
          Id: '1',
          date: new Date("2024-06-30"),
          estimatedStart: "11:00",
          estimatedEnd: "11:20",
          condition: '',
          doctorNote: "",
        }, {
          name: '',
          Id: '2',
          date: new Date("2024-07-01"),
          estimatedStart: "11:40",
          estimatedEnd: "12:00",
          condition: '',
          doctorNote: "",
        }, {
          name: '',
          Id: '3',
          date: new Date("2024-07-01"),
          estimatedStart: "10:00",
          estimatedEnd: "10:20",
          condition: '',
          doctorNote: "",
        }]
    );
  }
  async componentWillLoad() {
    this.waitingPatients = await this.getWaitingPatientsAsync();
    this.filteredPatients = this.waitingPatients;
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
    this.filteredPatients = this.waitingPatients.filter(patient => {
      const matchesDate = this.searchDate ? this.formatDate(new Date(patient.date)) === this.formatDate(new Date(this.searchDate)) : true;
      return matchesDate;
    });
  }

  private handleLogout(event: Event) {
    event.preventDefault();
    this.isLoggedOut = true;
  }

  private handleReserve(event: Event) {
    event.preventDefault();
    this.isReserved = true;
  }

  private handleClose(event: Event) {
    event.preventDefault();
    this.isClosed = true;
  }

  render() {
    if (this.isLoggedOut) {
      return (
          <boce-wac-project-login></boce-wac-project-login>
      );
    }

    if (this.isReserved) {
      return (
          <boce-wac-project-my-appointments></boce-wac-project-my-appointments>
      );
    }

    if (this.isClosed) {
      return (
          <boce-wac-project-my-appointments></boce-wac-project-my-appointments>
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
          {this.filteredPatients.length === 0 ? (
          <p>Žiadne voľné termíny vyšetrení pre zvolený dátum.</p>
        ) : (
          <md-list class="patient-list">
            {this.filteredPatients.map((patient, index) =>
              <md-list-item>
                <div slot="supporting-text">{"Termín vyšetrenia:" + this.formatDate(new Date(patient.date)) + " čas: " + patient.estimatedStart + " - " + patient.estimatedEnd}</div>
                <input slot='end' type="text" placeholder='Zadajte meno a priezvisko' onInput={(event) => this.handleNameInput(event, index)} />
                <input slot='end' type="text" placeholder='Zadajte dôvod vyšetrenia' onInput={(event) => this.handleReasonInput(event, index)} />
                <md-elevated-button slot="end" disabled={!this.nameInput[index] || !this.reasonInput[index]} onClick={(event) => this.handleReserve(event)}>Rezervuj vyšetrenie</md-elevated-button>
              </md-list-item>
            )}
          </md-list>
        )}

          <div class="back-flex">
            <md-elevated-button onClick={(event) => this.handleClose(event)}>Späť</md-elevated-button>
          </div>
        </div>
      </Host>
    );
  }
}
