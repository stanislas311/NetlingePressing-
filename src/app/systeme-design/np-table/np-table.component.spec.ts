import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { NpTableComponent } from './np-table.component';

@Component({
  standalone: true,
  imports: [NpTableComponent],
  template: `
    <np-table libelle="Liste des dépôts">
      <table>
        <tbody>
          <tr>
            <td>Contenu</td>
          </tr>
        </tbody>
      </table>
    </np-table>
  `,
})
class HoteComponent {}

describe('NpTableComponent', () => {
  let fixture: ComponentFixture<HoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HoteComponent] }).compileComponents();
    fixture = TestBed.createComponent(HoteComponent);
    fixture.detectChanges();
  });

  it('projette le tableau', () => {
    const table = (fixture.nativeElement as HTMLElement).querySelector('table');
    expect(table).not.toBeNull();
    expect(table!.textContent).toContain('Contenu');
  });

  it("présente une région de défilement focusable avec libellé", () => {
    const region = (fixture.nativeElement as HTMLElement).querySelector(
      '.np-table__defilement'
    ) as HTMLElement;
    expect(region).not.toBeNull();
    expect(region.getAttribute('role')).toBe('region');
    expect(region.getAttribute('aria-label')).toBe('Liste des dépôts');
    expect(region.getAttribute('tabindex')).toBe('0');
  });
});
