import { Component, State, Host, h, Prop } from '@stencil/core';
import { AppointmentsListApiFactory, AppointmentsList} from '../../api/boce-wac-project-ambulance-wl';

@Component({
  tag: 'boce-wac-project-planned-appointments',
  styleUrl: 'boce-wac-project-planned-appointments.css',
  shadow: true,
})
export class BoceWacProjectPlannedAppointments {
  @State() isLoggedOut: boolean = false;
  @State() isCancelled: boolean = false;
  @State() isBack: boolean = false;
  @State() searchQuery: string = '';
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
        this.errorMessage = `Cannot retrieve list of planned appointments: ${response.statusText}`
      }
    } catch (err: any) {
      this.errorMessage = `Cannot retrieve list of planned appointments: ${err.message || "unknown"}`
    }
    return [];
  }
  async componentWillLoad() {
    this.waitingPatients = await this.getAppointmentsListAsync();
    this.filterPatients();
  }
  private handleSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchQuery = input.value;
    this.filterPatients();
  }
  private formatDate(date: Date): string {
    return new Intl.DateTimeFormat('sk-SK', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date);
  }
  private filterPatients() {
    const today = new Date();
    this.filteredPatients = this.waitingPatients.filter(patient => {
      const matchesName = patient.name.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesDate = new Date(patient.date) > today;
      return matchesName && matchesDate;
    });
  }

  private handleLogout(event: Event) {
    event.preventDefault();
    this.isLoggedOut = true;
  }

  private async handleCancel(event: Event, patientId: string) {
    event.preventDefault();
    try {
      const response = await AppointmentsListApiFactory(undefined, this.apiBase).deleteAppointment(patientId);
      if (response.status < 299) {
        this.waitingPatients = this.waitingPatients.filter(patient => patient.id !== patientId);
        this.filterPatients();
        this.isCancelled = true;
      } else {
        this.errorMessage = `Failed to cancel appointment: ${response.statusText}`;
      }
    } catch (error) {
      this.errorMessage = `Error canceling appointment: ${error.message}`;
    }
  }

  private handleBack(event: Event) {
    event.preventDefault();
    this.isBack = true;
  }


  render() {
    if (this.isLoggedOut) {
      return (
        <boce-wac-project-login api-base={this.apiBase}></boce-wac-project-login>
      );
    }

    if (this.isCancelled) {
      return (
        <boce-wac-project-my-appointments api-base={this.apiBase}></boce-wac-project-my-appointments>
      );
    }

    if (this.isBack) {
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
          <h1>Moje plánované vyšetrenia</h1>
          <div class="filterflex">
            <div class="searchflex">
              <label class='headerinline'>Hladať podľa mena pacienta:</label>
              <input
                type="text"
                placeholder="Hľadať podľa mena"
                value={this.searchQuery}
                onInput={(event) => this.handleSearch(event)}
              />
            </div>
          </div>
          {this.errorMessage
            ? <div class="error">{this.errorMessage}</div>
            :(
          <div>  
            <md-list class="patient-list">
            {this.searchQuery.trim() === '' ? (
                <p>Zadajte meno pacienta do vyhľadávacieho poľa.</p>
              ) : this.filteredPatients.length > 0 ? (
                this.filteredPatients.map(patient =>
                  <md-list-item>
                    <div slot="headline">{patient.name}</div>
                    <div slot="supporting-text">{"Termín vyšetrenia: " + this.formatDate(new Date(patient.date)) + " čas: " + patient.estimatedStart + " - " + patient.estimatedEnd}</div>
                    <div slot='supporting-text'>{"Dôvod vyšetrenia: " + patient.condition}</div>
                    <div slot="supporting-text">{"Záznam o vykonanom vyšetrení: " + patient.doctorNote}</div>
                    <md-elevated-button slot="end" onClick={(event) => this.handleCancel(event, patient.id)}>Zruš vyšetrenie</md-elevated-button>
                    <md-icon slot="start">person</md-icon>
                  </md-list-item>
                )
              ) : (
                <p>Nenašli sa žiadne plánované vyšetrenia pre zadané meno.</p>
              )}
            </md-list>
          </div> )} 
          <div class="add-term">
            <md-elevated-button onClick={(event) => this.handleBack(event)}>Spät na históriu vyšetrení</md-elevated-button>
          </div>
        </div>
      </Host>
    );
  }
}