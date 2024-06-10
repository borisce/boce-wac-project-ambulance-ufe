import { Component, Host, h, State, Prop} from '@stencil/core';
import { AppointmentsListApiFactory, AppointmentsList } from '../../api/boce-wac-project-ambulance-wl';


@Component({
  tag: 'boce-wac-project-create-term',
  styleUrl: 'boce-wac-project-create-term.css',
  shadow: true,
})
export class BoceWacProjectCreateTerm {

  @State() isTermCreated: boolean = false;
  @State() isCreateTermClosed: boolean = false;
  @State() isLoggedOut: boolean = false;
  @State() date: string = '';
  @State() estimatedStart: string = '';
  @State() estimatedEnd: string = '';
  @State() errorMessage: string = '';
  @Prop() apiBase: string;

  private handleLogout(event: Event) {
    event.preventDefault();
    this.isLoggedOut = true;
  }

  private handleClose(event: Event) {
    event.preventDefault();
    this.isCreateTermClosed = true;
  }

  private async handleCreateTerm(event: Event) {
    event.preventDefault();
    this.errorMessage = ''
    const newPatient : AppointmentsList = {
      name: "",
      date: this.date,
      estimatedStart: this.estimatedStart,
      estimatedEnd: this.estimatedEnd,
      condition: "",
      doctorNote: "",
      patientAppointed: false,
    };

    try {
      const response = await  AppointmentsListApiFactory(undefined, this.apiBase).createAppointment(newPatient);
      if (response.status === 201) {
        this.isTermCreated = true
      } else {
        console.error('Failed to create term', response);
        this.errorMessage = 'Error failed to create term.'
      }
    } catch (error) {
      console.error('Error creating term', error);
      this.errorMessage = 'Error cannot create term.'
    }
  }

  private handleInputChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this[input.id] = input.value;
  }

  private allFieldsFilled() {
    return this.date && this.estimatedStart && this.estimatedEnd;
  }

  render() {
    if (this.isLoggedOut) {
      return (
        <boce-wac-project-login api-base={this.apiBase}></boce-wac-project-login>
      );
    }

    if (this.isCreateTermClosed) {
      return (
        <boce-wac-project-doctor-patients-list api-base={this.apiBase}></boce-wac-project-doctor-patients-list>
      );
    }

    if (this.isTermCreated) {
      return (
        <boce-wac-project-doctor-patients-list api-base={this.apiBase}></boce-wac-project-doctor-patients-list>
      );
    }

    return (
      <Host>
        <header>
          <md-elevated-button onClick={(event) => this.handleLogout(event)}>Odhlásiť sa</md-elevated-button>
        </header>
        <h1>Vytvorenie nového voľného termínu vyšetrenia</h1>
        <form action="#">
          <div class="form-flex">
            <label htmlFor="date">Dátum vyšetrenia</label>
            <input type="date" id="date" min={new Date().toISOString().split('T')[0]} value={this.date} onInput={(event) => this.handleInputChange(event)} />
            <label htmlFor="estimatedStart">Čas začiatku vyšetrenia</label>
            <input type="time" id="estimatedStart" value={this.estimatedStart} onInput={(event) => this.handleInputChange(event)} />
            <label htmlFor="estimatedEnd">Čas ukončenia vyšetrenia</label>
            <input type="time" id="estimatedEnd" value={this.estimatedEnd} onInput={(event) => this.handleInputChange(event)} />
            <div class="button-flex">
              <md-elevated-button onClick={(event) => this.handleClose(event)}>Zrušiť</md-elevated-button>
              <md-elevated-button onClick={(event) => this.handleCreateTerm(event)} disabled={!this.allFieldsFilled()}>Vytvoriť voľný termín</md-elevated-button>
            </div>
          </div>
        </form>
        {this.errorMessage && <div class="error">{this.errorMessage}</div>}
      </Host>
    );
  }
}
