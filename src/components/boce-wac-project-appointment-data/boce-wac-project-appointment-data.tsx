import { Component, Host, Prop, h, State } from '@stencil/core';
import { AppointmentsListApiFactory, AppointmentsList } from '../../api/boce-wac-project-ambulance-wl';


@Component({
  tag: 'boce-wac-project-appointment-data',
  styleUrl: 'boce-wac-project-appointment-data.css',
  shadow: true,
})
export class BoceWacProjectAppointmentData {
  @Prop() patient: any;
  @State() isEditorClosed: boolean = false;
  @State() isLoggedOut: boolean = false;
  @State() isAppointmentChanged: boolean = false;
  @State() isSaveEnabled: boolean = false;
  @State() doctorNote: string;
  @Prop() apiBase: string;

  private handleLogout(event: Event) {
    event.preventDefault();
    this.isLoggedOut = true;
  }

  private handleClose(event: Event) {
    event.preventDefault();
    this.isEditorClosed = true;
  }

  private async handleSave(event: Event) {
    event.preventDefault();
    try {
      const updatedPatient: AppointmentsList = {
        ...this.patient,
        doctorNote: this.doctorNote
      };
      const response = await AppointmentsListApiFactory(undefined, this.apiBase).updateAppointment(updatedPatient)
      if (response.status === 200) {
        this.isAppointmentChanged = true;
      } else {
        console.error('Failed to update appointment', response);
      }
    } catch (error) {
      console.error('Error updating appointment', error);
    }
  }

  private handleTextareaChange(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;
    this.doctorNote = textarea.value;
    this.isSaveEnabled = this.doctorNote !== this.patient.doctorNote;
  }

  private formatDate(date: Date): string {
    if (!date || isNaN(date.getTime())) {
      return 'Invalid Date';
    }
    return new Intl.DateTimeFormat('sk-SK', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date);
  }

  componentWillLoad() {
    this.doctorNote = this.patient.doctorNote;
    console.log(this.patient)
  }

  render() {
    if (this.isLoggedOut) {
      return (
        <boce-wac-project-login api-base={this.apiBase}></boce-wac-project-login>
      );
    }
    if (this.isEditorClosed) {
      return (
        <boce-wac-project-doctor-patients-list api-base={this.apiBase}></boce-wac-project-doctor-patients-list>
      );
    }
    if (this.isAppointmentChanged) {
      return (
        <boce-wac-project-doctor-patients-list api-base={this.apiBase}></boce-wac-project-doctor-patients-list>
      );
    }
    return (
      <Host>
        <div class="component-body">
          <header>
            <md-elevated-button onClick={(event) => this.handleLogout(event)}>Odhlásiť sa</md-elevated-button>
          </header>
          <h1>Záznam o vyšetrení</h1>
          <div class="data-flex">
            <div class="patient-flex">
              <p><strong>Meno pacienta:</strong> {this.patient.name}</p>
            </div>
            <p><strong>Termín vyšetrenia:</strong> {this.formatDate(new Date(this.patient.date))} {this.patient.estimatedStart} - {this.patient.estimatedEnd}</p>
            <p><strong>Dôvod vyšetrenia:</strong> {this.patient.condition}</p>
            <label htmlFor="appointment_data_textarea">Záznam lekára o vykonanom vyšetrení:</label>
            <textarea name="appointment_data" id="appointment_data_textarea" value={this.doctorNote} onInput={(event) => this.handleTextareaChange(event)}></textarea>
          </div>
          <div class="buttons-flex">
            <md-elevated-button onClick={(event) => this.handleClose(event)}>Zrušiť</md-elevated-button>
            <md-elevated-button onClick={(event) => this.handleSave(event)} disabled={!this.isSaveEnabled}>Uložiť</md-elevated-button>
          </div>
        </div>
      </Host>
    );
  }
}
