import { Component, inject } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NpButtonComponent } from '../../systeme-design/np-button/np-button.component';
import { NpFormFieldComponent } from '../../systeme-design/np-form-field/np-form-field.component';
import { TarifService } from '../services/tarif.service';

@Component({
  selector: 'app-tarifs',
  imports: [ReactiveFormsModule, NpButtonComponent, NpFormFieldComponent],
  templateUrl: './tarifs.component.html',
  styleUrl: './tarifs.component.css',
})
export class TarifsComponent {
  private readonly fb = inject(FormBuilder);
  private readonly tarifs = inject(TarifService);
  message: string | null = null;

  readonly form = this.fb.group({
    lignes: this.fb.array(
      this.tarifs.lister().map((t) =>
        this.fb.group({
          type: [t.type, Validators.required],
          service: [t.service, Validators.required],
          prix: [t.prix, [Validators.required, Validators.min(0)]],
        })
      )
    ),
  });

  get lignes(): FormArray {
    return this.form.controls.lignes as FormArray;
  }

  enregistrer(): void {
    if (this.form.invalid) {
      this.message = 'Vérifiez les tarifs saisis.';
      return;
    }
    this.tarifs.enregistrer(this.lignes.getRawValue());
    this.message = 'Catalogue des tarifs enregistré.';
  }
}
