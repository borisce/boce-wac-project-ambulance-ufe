import {Component, Host, Prop, h, State} from '@stencil/core';
import { AppointmentsListApiFactory, AppointmentsList } from '../../api/boce-wac-project-ambulance-wl';


@Component({
  tag: 'boce-wac-project-create-patient',
  styleUrl: 'boce-wac-project-create-patient.css',
  shadow: true,
})
export class BoceWacProjectCreatePatient {
  @Prop() entryId: string;
  @State() isCreateClosed: boolean = false;
  @State() isPatientCreated: boolean = false;
  @State() isLoggedOut: boolean = false;

  @State() name: string = '';
  @State() date: string = '';
  @State() estimatedStart: string = '';
  @State() estimatedEnd: string = '';
  @State() condition: string = '';
  @State() doctorNote: string = '';
  @Prop() apiBase: string;

  private allFieldsFilled() {
    return this.name && this.date && this.estimatedStart && this.estimatedEnd && this.condition && this.doctorNote;
  }

  private handleLogout(event: Event) {
    event.preventDefault();
    this.isLoggedOut = true;
  }

  private handleClose(event: Event) {
    event.preventDefault();
    this.isCreateClosed = true;
  }

  private handleInputChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this[input.id] = input.value;
  }

  private async handleCreatePatient(event: Event) {
    event.preventDefault();
    const newPatient : AppointmentsList = {
      name: this.name,
      date: this.date,
      estimatedStart: this.estimatedStart,
      estimatedEnd: this.estimatedEnd,
      condition: this.condition,
      doctorNote: this.doctorNote,
      patientAppointed: true,
    };

    try {
      const response = await  AppointmentsListApiFactory(undefined, this.apiBase).createAppointment(newPatient);
      if (response.status === 201) {
        this.isPatientCreated = true;
      } else {
        console.error('Failed to create patient', response);
      }
    } catch (error) {
      console.error('Error creating patient', error);
    }
  }

  render() {
    if (this.isLoggedOut) {
      return (
        <boce-wac-project-login api-base={this.apiBase}></boce-wac-project-login>
      );
    }

    if (this.isCreateClosed) {
      return (
        <boce-wac-project-doctor-patients-list api-base={this.apiBase}></boce-wac-project-doctor-patients-list>
      );
    }

    if (this.isPatientCreated) {
      return (
        <boce-wac-project-doctor-patients-list api-base={this.apiBase}></boce-wac-project-doctor-patients-list>
      );
    }

    return (
      <Host>
        <header>
          <md-elevated-button onClick={(event) => this.handleLogout(event)}>Odhlásiť sa</md-elevated-button>
        </header>
        <h1>Vytvorenie celého záznamu vyšetrenia pacienta</h1>
        <form action="#">
          <div class="form-flex">
            <h3>Osobné údaje pacienta</h3>
            <label htmlFor="name">Meno a priezvisko</label>
            <input type="text" id="name" value={this.name} onInput={(event) => this.handleInputChange(event)} />
            <h3>Údaje o vyšetrení</h3>
            <label htmlFor="date">Dátum vyšetrenia</label>
            <input type="date" id="date" value={this.date} onInput={(event) => this.handleInputChange(event)}  />
            <label htmlFor="estimatedStart">Čas začiatku vyšetrenia</label>
            <input type="time" id="estimatedStart" value={this.estimatedStart} onInput={(event) => this.handleInputChange(event)} />
            <label htmlFor="estimatedEnd">Čas ukončenia vyšetrenia</label>
            <input type="time" id="estimatedEnd" value={this.estimatedEnd} onInput={(event) => this.handleInputChange(event)} />
            <label htmlFor="condition">Dôvod vyšetrenia</label>
            <input type="text" placeholder='' id="condition" value={this.condition} onInput={(event) => this.handleInputChange(event)} />
            <label htmlFor="doctorNote">Záznam lekára o vykonanom vyšetrení</label>
            <input type="text" id="doctorNote" value={this.doctorNote} onInput={(event) => this.handleInputChange(event)} />
            <div class="button-flex">
              <md-elevated-button onClick={(event) => this.handleClose(event)}>Zrušiť</md-elevated-button>
              <md-elevated-button onClick={(event) => this.handleCreatePatient(event)} disabled={!this.allFieldsFilled()}>Vytvoriť záznam o vyšetrení</md-elevated-button>
            </div>
          </div>  
        </form>
      </Host>
    );  
  }
}