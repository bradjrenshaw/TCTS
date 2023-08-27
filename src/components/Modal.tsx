import { useEffect, useRef, useState } from "react";

const Modal = ({visible, onClose, children}: {visible: boolean, onClose: any, children: any}) => {
        let [isOpen, setIsOpen] = useState(false);
        let dialogRef = useRef<HTMLDialogElement>(null);
        useEffect(() => {
            if (!dialogRef.current) return;
            if (visible && !isOpen) {
                dialogRef.current.removeAttribute('open');
                dialogRef.current.addEventListener('cancel', onClose);
                dialogRef.current.showModal();
                setIsOpen(true);
            } else if (!visible && isOpen) {
                dialogRef.current.close();
                dialogRef.current.removeEventListener('cancel', onClose);
                setIsOpen(false);
            }
        }, [visible, isOpen, onClose]);

    return <dialog ref={dialogRef}>
        {children}
    </dialog>
};

export default Modal;