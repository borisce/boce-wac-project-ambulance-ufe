import { Component, State, Host, h, Prop } from '@stencil/core';
import { AppointmentsListApiFactory, AppointmentsList} from '../../api/boce-wac-project-ambulance-wl';

@Component({
  tag: 'boce-wac-project-my-appointments',
  styleUrl: 'boce-wac-project-my-appointments.css',
  shadow: true,
})
export class BoceWacProjectMyAppointments {
  @State() isLoggedOut: boolean = false;
  @State() isPlannedClicked: boolean = false;
  @State() isAvailableClicked: boolean = false;
  @State() searchQuery: string = ''; 
  @State() searchDate: string = ''; 
  @State() filteredPatients: AppointmentsList[] = []; 
  @Prop() apiBase: string;
  @Prop() ambulanceId: string;
  @State() errorMessage: string;
  waitingPatients: AppointmentsList[];
  private async getAppointmentsListAsync() {
    try {
      const response = await
        AppointmentsListApiFactory(undefined, this.apiBase).
          getAppointmentsList()
      if (response.status < 299) {
        return response.data;
      } else {
        this.errorMessage = `Cannot retrieve list of appointments: ${response.statusText}`
      }
    } catch (err: any) {
      this.errorMessage = `Cannot retrieve list of appointments: ${err.message || "unknown"}`
    }
    return [];
  }
  async componentWillLoad() {
    this.waitingPatients = await this.getAppointmentsListAsync();

    const today = new Date().toISOString().split("T")[0];

    // Filter appointments to include only those with dates today or older
    this.waitingPatients = this.waitingPatients.filter(appointment => {
    return appointment.date <= today;
  });
  }
  private formatDate(date: Date): string {
    return new Intl.DateTimeFormat('sk-SK', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date);
  }
  private handleSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchQuery = input.value;
    this.filterPatients();
  }
  private handleDateChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchDate = input.value;
    this.filterPatients();
  }
  private filterPatients() {
    const formattedSearchDate = this.searchDate ? new Date(this.searchDate).toISOString().slice(0, 10) : '';
    this.filteredPatients = this.waitingPatients.filter(patient => {
      const matchesName = patient.name.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesDate = this.searchDate ? new Date(patient.date).toISOString().slice(0, 10) === formattedSearchDate : true;
      return matchesName && matchesDate;
    });
  }

  private handleLogout(event: Event) {
    event.preventDefault();
    this.isLoggedOut = true;
  }

  private handlePlannedClick(event: Event) {
    event.preventDefault();
    this.isPlannedClicked = true;
  }

  private handleAvailableClick(event: Event) {
    event.preventDefault();
    this.isAvailableClicked = true;
  }

  render() {
    if (this.isLoggedOut) {
      return (
        <boce-wac-project-login api-base={this.apiBase}></boce-wac-project-login>
      );
    }
    if (this.isPlannedClicked) {
      return (
        <boce-wac-project-planned-appointments api-base={this.apiBase}></boce-wac-project-planned-appointments>
      );
    }
    if (this.isAvailableClicked) {
      return (
        <boce-wac-project-reserve-appointment api-base={this.apiBase}></boce-wac-project-reserve-appointment>
      );
    }
    return (
      <Host>
        <div class="component-body">
          <header>
            <md-elevated-button onClick={(event) => this.handleLogout(event)}>Odhlásiť sa</md-elevated-button>
          </header>
          <h1>História mojich vyšetrení</h1>
          <div class="filterflex">
            <div class="searchflex">
              <label class='headerinline'>Hľadať podľa mena pacienta:</label>
              <input
                type="text"
                placeholder="Hľadať podľa mena"
                value={this.searchQuery}
                onInput={(event) => this.handleSearch(event)}
              />
            </div>
            <div class="datepickerflex">
              <p class='headerinline'>Vyberte deň:</p>
              <input type="date" id="Test_DatetimeLocal" value={this.searchDate} max={new Date().toISOString().split("T")[0]} onInput={(event) => this.handleDateChange(event)} />
            </div>
          </div>
          {this.errorMessage
        ? <div class="error">{this.errorMessage}</div>
        :(
          <div>
          <md-list class="patient-list">
            {this.searchQuery.trim() === '' ? (
              <p>Zadajte svoje meno do vyhľadávacieho poľa.</p>
            ) : 
            this.filteredPatients.length > 0 ? (
              this.filteredPatients.map(patient =>
                <md-list-item>
                  <div slot="headline">{patient.name}</div>
                  <div slot="supporting-text">{"Termín vyšetrenia: " + this.formatDate(new Date(patient.date)) + " čas: " + patient.estimatedStart + " - " + patient.estimatedEnd}</div>
                  <div slot='supporting-text'>{"Dôvod vyšetrenia: " + patient.condition}</div>
                  <div slot="supporting-text">{"Záznam o vykonanom vyšetrení: " + patient.doctorNote}</div>
                  <md-icon slot="start">person</md-icon>
                </md-list-item>
              )
            ) : (
              <p>Nenašli sa žiadne záznamy pre zadané meno a dátum.</p>
            )}
          </md-list>
          </div>)} 
          <div class="add-term">
            <md-elevated-button onClick={(event) => this.handlePlannedClick(event)}>Zobraz plánované vyšetrenia</md-elevated-button>
            <md-elevated-button onClick={(event) => this.handleAvailableClick(event)}>Objednanie sa na termín vyšetrenia</md-elevated-button>
          </div>
        </div>
      </Host>
    );
  }
}
