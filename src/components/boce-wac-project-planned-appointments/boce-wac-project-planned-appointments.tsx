import { Component, State, Host, h } from '@stencil/core';

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
  @State() filteredPatients: any[] = []; 
  waitingPatients: any[];
  private async getWaitingPatientsAsync() {
    return await Promise.resolve(
      [{
        name: 'Jožko Púčik',
        Id: '1',
        date: new Date("2024-07-01"),
        estimatedStart: "11:00",
        estimatedEnd: "11:20",
        condition: 'Kontrola',
        doctorNote: "",
      }, {
        name: 'Jožko Púčik',
        Id: '2',
        date: new Date("2024-06-30"),
        estimatedStart: "11:40",
        estimatedEnd: "12:00",
        condition: 'Teploty',
        doctorNote: "",
      }, {
        name: 'Ing. Ferdinand Trety',
        Id: '3',
        date: new Date("2024-06-30"),
        estimatedStart: "10:00",
        estimatedEnd: "10:20",
        condition: 'Bolesti hrdla',
        doctorNote: "",
      }]
    );
  }
  async componentWillLoad() {
    this.waitingPatients = await this.getWaitingPatientsAsync();
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
    const today = new Date(); // Get today's date
    //const formattedToday = today.toISOString().slice(0, 10); // Format today's date
    this.filteredPatients = this.waitingPatients.filter(patient => {
      const matchesName = patient.name.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesDate = new Date(patient.date) >= today; // Check if the patient's date is today or from the future
      return matchesName && matchesDate;
    });
  }

  private handleLogout(event: Event) {
    event.preventDefault();
    this.isLoggedOut = true;
  }

  private handleCancel(event: Event) {
    event.preventDefault();
    this.isCancelled = true;
  }

  private handleBack(event: Event) {
    event.preventDefault();
    this.isBack = true;
  }


  render() {
    if (this.isLoggedOut) {
      return (
        <boce-wac-project-login></boce-wac-project-login>
      );
    }

    if (this.isCancelled) {
      return (
        <boce-wac-project-my-appointments></boce-wac-project-my-appointments>
      );
    }

    if (this.isBack) {
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
                  <md-elevated-button slot="end" onClick={(event) => this.handleCancel(event)}>Zruš vyšetrenie</md-elevated-button>
                  <md-icon slot="start">person</md-icon>
                </md-list-item>
              )
            ) : (
              <p>Nenašli sa žiadne plánované vyšetrenia pre zadané meno.</p>
            )}
          </md-list>
          <div class="add-term">
            <md-elevated-button onClick={(event) => this.handleBack(event)}>Spät na históriu vyšetrení</md-elevated-button>
          </div>
        </div>
      </Host>
    );
  }
}