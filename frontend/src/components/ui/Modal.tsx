import React, { forwardRef, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';
import { Icons } from './Icon';
import { Button } from './Button';

const modalVariants = cva(
  'relative bg-white rounded-lg shadow-xl w-full max-w-md mx-auto transform transition-all duration-300 ease-out',
  {
    variants: {
      size: {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        '2xl': 'max-w-2xl',
        full: 'max-w-full mx-4',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

export interface ModalProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof modalVariants> {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

const Modal = forwardRef<HTMLDivElement, ModalProps>(
  ({ 
    className, 
    size, 
    isOpen, 
    onClose, 
    title, 
    description, 
    showCloseButton = true,
    closeOnOverlayClick = true,
    closeOnEscape = true,
    children, 
    footer,
    ...props 
  }, ref) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const previousActiveElement = useRef<HTMLElement | null>(null);

    useEffect(() => {
      if (isOpen) {
        // Store the currently focused element
        previousActiveElement.current = document.activeElement as HTMLElement;
        
        // Focus the modal
        if (modalRef.current) {
          modalRef.current.focus();
        }
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
      } else {
        // Restore focus
        if (previousActiveElement.current) {
          previousActiveElement.current.focus();
        }
        
        // Restore body scroll
        document.body.style.overflow = 'unset';
      }

      return () => {
        document.body.style.overflow = 'unset';
      };
    }, [isOpen]);

    useEffect(() => {
      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === 'Escape' && closeOnEscape) {
          onClose();
        }
      };

      if (isOpen) {
        document.addEventListener('keydown', handleEscape);
      }

      return () => {
        document.removeEventListener('keydown', handleEscape);
      };
    }, [isOpen, onClose, closeOnEscape]);

    const handleOverlayClick = (event: React.MouseEvent) => {
      if (closeOnOverlayClick && event.target === event.currentTarget) {
        onClose();
      }
    };

    if (!isOpen) return null;

    const modalContent = (
      <div
        className="fixed inset-0 z-modalBackdrop bg-black bg-opacity-50 flex items-center justify-center p-4"
        onClick={handleOverlayClick}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        aria-describedby={description ? 'modal-description' : undefined}
      >
        <div
          ref={modalRef}
          className={cn(
            modalVariants({ size }),
            'animate-scale',
            className
          )}
          tabIndex={-1}
          role="document"
          {...props}
        >
          {/* Header */}
          {(title || showCloseButton) && (
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex-1">
                {title && (
                  <h2 
                    id="modal-title"
                    className="text-lg font-semibold text-gray-900"
                  >
                    {title}
                  </h2>
                )}
                {description && (
                  <p 
                    id="modal-description"
                    className="mt-1 text-sm text-gray-600"
                  >
                    {description}
                  </p>
                )}
              </div>
              
              {showCloseButton && (
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={onClose}
                  aria-label="Chiudi modale"
                  className="ml-4"
                >
                  <Icons.Close />
                </Button>
              )}
            </div>
          )}

          {/* Content */}
          <div className="p-6">
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-lg">
              {footer}
            </div>
          )}
        </div>
      </div>
    );

    return createPortal(modalContent, document.body);
  }
);

Modal.displayName = 'Modal';

// Convenience components for common modal patterns
export const ConfirmModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
}> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Conferma',
  cancelText = 'Annulla',
  variant = 'info'
}) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return {
          buttonVariant: 'error' as const,
          icon: <Icons.Close className="text-error-600" />
        };
      case 'warning':
        return {
          buttonVariant: 'warning' as const,
          icon: <Icons.Bell className="text-warning-600" />
        };
      default:
        return {
          buttonVariant: 'primary' as const,
          icon: <Icons.Settings className="text-primary-600" />
        };
    }
  };

  const { buttonVariant, icon } = getVariantStyles();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          {icon}
        </div>
        <div className="flex-1">
          <p className="text-sm text-gray-700">
            {message}
          </p>
        </div>
      </div>
      
      <div className="flex items-center justify-end gap-3 mt-6">
        <Button
          variant="outline"
          onClick={onClose}
        >
          {cancelText}
        </Button>
        <Button
          variant={buttonVariant}
          onClick={handleConfirm}
        >
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
};

export { Modal, modalVariants }; 