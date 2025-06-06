<template>
  <div 
    class="modal fade" 
    :id="modalId" 
    ref="modalElement"
    tabindex="-1"
    aria-hidden="true"
    data-bs-backdrop="static"
  >
    <div class="modal-dialog" :class="modalDialogClasses">
      <div class="modal-content" :class="contentClasses">
        <!-- Header -->
        <div class="modal-header" v-if="showHeader">
          <slot name="header">
            <h5 class="modal-title fs-5" v-if="title">{{ title }}</h5>
            <button 
              type="button" 
              class="btn-close" 
              data-bs-dismiss="modal" 
              aria-label="Close"
              v-if="closable"
            ></button>
          </slot>
        </div>

        <!-- Body -->
        <div class="modal-body" :class="bodyClasses">
          <slot>
            <img 
              v-if="imageSrc" 
              :src="imageSrc" 
              :alt="imageAlt" 
              class="img-fluid rounded shadow" 
              :style="imageStyle"
            >
            <p v-if="description" class="mb-0">{{ description }}</p>
          </slot>
        </div>

        <!-- Footer -->
        <div class="modal-footer" v-if="showFooter">
          <slot name="footer">
            <button 
              type="button" 
              class="btn btn-secondary" 
              data-bs-dismiss="modal"
              v-if="closable"
            >
              {{ closeButtonText }}
            </button>
            <button 
              type="button" 
              class="btn btn-primary"
              @click="handleConfirm"
              v-if="confirmable"
            >
              {{ confirmButtonText }}
            </button>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Modal } from 'bootstrap'

export default {
  name: 'ModalComponent',
  props: {
    modalId: {
      type: String,
      required: true,
      validator: (value) => value.startsWith('modal-')
    },
    title: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    },
    imageSrc: {
      type: String,
      default: ''
    },
    imageAlt: {
      type: String,
      default: 'Modal image'
    },
    size: {
      type: String,
      default: 'md',
      validator: (value) => ['sm', 'md', 'lg', 'xl', 'fullscreen'].includes(value)
    },
    position: {
      type: String,
      default: 'centered',
      validator: (value) => ['centered', 'top', 'bottom'].includes(value)
    },
    closable: {
      type: Boolean,
      default: true
    },
    confirmable: {
      type: Boolean,
      default: false
    },
    closeButtonText: {
      type: String,
      default: 'Close'
    },
    confirmButtonText: {
      type: String,
      default: 'Confirm'
    },
    backdrop: {
      type: [Boolean, String],
      default: true,
      validator: (value) => [true, false, 'static'].includes(value)
    },
    imageMaxHeight: {
      type: String,
      default: '80vh'
    },
    scrollable: {
      type: Boolean,
      default: false
    }
  },
  emits: ['confirmed', 'hidden', 'shown'],
  data() {
    return {
      modal: null
    }
  },
  computed: {
    modalDialogClasses() {
      return [
        `modal-${this.size}`,
        {
          'modal-dialog-centered': this.position === 'centered',
          'modal-dialog-top': this.position === 'top',
          'modal-dialog-bottom': this.position === 'bottom',
          'modal-dialog-scrollable': this.scrollable
        }
      ]
    },
    contentClasses() {
      return {
        'bg-transparent': !this.showHeader && !this.showFooter,
        'border-0': !this.showHeader && !this.showFooter
      }
    },
    bodyClasses() {
      return {
        'p-0': !this.description && this.imageSrc,
        'text-center': this.imageSrc
      }
    },
    imageStyle() {
      return {
        maxHeight: this.imageMaxHeight,
        width: this.imageSrc ? 'auto' : '100%'
      }
    },
    showHeader() {
      return this.title || this.$slots.header
    },
    showFooter() {
      return this.confirmable || this.closable || this.$slots.footer
    }
  },
  mounted() {
    this.initModal()
  },
  beforeUnmount() {
    this.disposeModal()
  },
  methods: {
    initModal() {
      this.modal = new Modal(this.$refs.modalElement, {
        backdrop: this.backdrop,
        keyboard: this.closable
      })

      // Event forwarding
      this.$refs.modalElement.addEventListener('hidden.bs.modal', () => {
        this.$emit('hidden')
      })
      this.$refs.modalElement.addEventListener('shown.bs.modal', () => {
        this.$emit('shown')
      })
    },
    disposeModal() {
      if (this.modal) {
        this.modal.dispose()
      }
    },
    show() {
      this.modal?.show()
    },
    hide() {
      this.modal?.hide()
    },
    toggle() {
      this.modal?.toggle()
    },
    handleConfirm() {
      this.$emit('confirmed')
      if (this.closable) {
        this.hide()
      }
    }
  }
}
</script>

<style scoped>
/* Modern enhancements */
.modal-content {
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  border: none;
  transition: transform 0.3s ease-out, opacity 0.3s ease;
}

.modal.show .modal-content {
  transform: translateY(0);
  opacity: 1;
}

.modal.fade .modal-content {
  transform: translateY(-20px);
  opacity: 0;
}

.modal-header {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.03);
}

.modal-footer {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.03);
}

/* Fullscreen specific styling */
.modal-fullscreen .modal-content {
  border-radius: 0;
}
</style>