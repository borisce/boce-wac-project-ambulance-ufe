import {Component, Host, Prop, h, State} from '@stencil/core';

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

  private handleLogout(event: Event) {
    event.preventDefault();
    this.isLoggedOut = true;
  }

  private handleClose(event: Event) {
    event.preventDefault();
    this.isCreateClosed = true;
  }

  private handleCreatePatient(event: Event) {
    event.preventDefault();
    this.isPatientCreated = true;
  }

  render() {
    if (this.isLoggedOut) {
      return (
        <boce-wac-project-login></boce-wac-project-login>
      );
    }

    if (this.isCreateClosed) {
      return (
        <boce-wac-project-doctor-patients-list></boce-wac-project-doctor-patients-list>
      );
    }

    if (this.isPatientCreated) {
      return (
        <boce-wac-project-doctor-patients-list></boce-wac-project-doctor-patients-list>
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
            <input type="text" id="name" />
            <h3>Údaje o vyšetrení</h3>
            <label htmlFor="date">Dátum vyšetrenia</label>
            <input type="date" id="date" />
            <label htmlFor="begintime">Čas začiatku vyšetrenia</label>
            <input type="time" id="begintime" />
            <label htmlFor="endtime">Čas ukončenia vyšetrenia</label>
            <input type="time" id="endtime" />
            <label htmlFor="condition">Dôvod vyšetrenia</label>
            <input type="text" placeholder='' id="condition" />
            <label htmlFor="note">Záznam lekára o vykonanom vyšetrení</label>
            <input type="text" id="note" />
            <div class="button-flex">
              <md-elevated-button onClick={(event) => this.handleClose(event)}>Zrušiť</md-elevated-button>
              <md-elevated-button onClick={(event) => this.handleCreatePatient(event)}>Vytvoriť záznam o vyšetrení</md-elevated-button>
            </div>
          </div>  
        </form>
      </Host>
    );  
  }
}