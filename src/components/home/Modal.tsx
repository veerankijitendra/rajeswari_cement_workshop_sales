import React, { useState, ReactNode } from "react";
import { X } from "lucide-react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-0 sm:mx-4 relative h-full sm:h-auto overflow-auto">
                <button
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 z-50"
                    onClick={onClose}
                    aria-label="Close"
                >
                    <X size={24} />
                </button>
                {title && (
                    <div className="px-6 pt-6 pb-2 text-lg font-semibold border-b">
                        {title}
                    </div>
                )}
                <div className="max-h-svh h-auto overflow-auto">{children}</div>
            </div>
        </div>
    );
};

// Example usage
export const ModalDemo: React.FC = () => {
    const [open, setOpen] = useState(false);

    return (
        <div>
            <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={() => setOpen(true)}
            >
                Open Modal
            </button>
            <Modal isOpen={open} onClose={() => setOpen(false)} title="Demo Modal">
                <p>This is a modal content.</p>
            </Modal>
        </div>
    );
};

export default Modal;