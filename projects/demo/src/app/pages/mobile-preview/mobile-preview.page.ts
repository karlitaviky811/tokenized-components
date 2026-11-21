import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  signal,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { Overlay } from '@angular/cdk/overlay';
import { ConfirmModal, LibButtonComponent, LibListComponent, LibListItemData } from 'crdx-components';

@Component({
  selector: 'app-mobile-preview-page',
  standalone: true,
  imports: [LibButtonComponent, LibListComponent],
  templateUrl: './mobile-preview.page.html',
  styleUrl: './mobile-preview.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobilePreviewPage {
  @ViewChild('fileInput') private fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('galleryTemplate', { static: true }) private galleryTemplate!: TemplateRef<unknown>;

  private readonly dialog = inject(Dialog);
  private readonly overlay = inject(Overlay);

  private galleryDialogRef?: DialogRef<unknown, ConfirmModal>;

  readonly galleryItems = signal<LibListItemData[]>([
    { id: 'photos', label: 'Abrir galería' },
    { id: 'camera', label: 'Tomar foto' },
    { id: 'docs',   label: 'Abrir documentos' },
  ]);

  readonly galleryIconMap = new Map([
    ['photos', 'add_photo_alternate'],
    ['camera', 'photo_camera'],
    ['docs',   'add_notes'],
  ]);

  private centeredPos() {
    return this.overlay.position().global().centerHorizontally().centerVertically();
  }

  openGalleryDialog(): void {
    this.galleryDialogRef = this.dialog.open(ConfirmModal, {
      width: '19.5rem',
      positionStrategy: this.centeredPos(),
      panelClass: 'lib-confirm-modal-panel',
      backdropClass: 'lib-confirm-modal-backdrop',
      disableClose: true,
      autoFocus: false,
      data: {
        title: 'Adjuntar archivo',
        description: 'Elige cómo quieres adjuntar tu documento o foto.',
        labelButtonCancel: 'Cancelar',
        labelButtonConfirm: 'Continuar',
        primaryFilled: true,
        bodyTemplate: this.galleryTemplate,
      },
    });

    this.galleryDialogRef!.closed.subscribe((result) => {
      const input = this.fileInput.nativeElement;
      if (result === 'photos') {
        input.accept = 'image/*';
        input.removeAttribute('capture');
        input.click();
      } else if (result === 'camera') {
        input.accept = 'image/*';
        input.setAttribute('capture', 'environment');
        input.click();
      } else if (result === 'docs') {
        input.accept = '*/*';
        input.removeAttribute('capture');
        input.click();
      }
    });
  }

  onGalleryItemClick(item: LibListItemData): void {
    this.galleryDialogRef?.close(item.id);
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      console.log('Archivo seleccionado:', file.name, file.type, file.size);
    }
  }
}
