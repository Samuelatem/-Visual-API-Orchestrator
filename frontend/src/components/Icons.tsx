// Simple SVG Icon Components to replace @mui/icons-material while avoiding package issues

interface IconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

export function CheckCircleIcon({ className = '', ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={`icon ${className}`} {...props} fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
    </svg>
  );
}

export function ErrorIcon({ className = '', ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={`icon ${className}`} {...props} fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m1 15h-2v-2h2v2m0-4h-2V7h2v6z"/>
    </svg>
  );
}

export function CloseIcon({ className = '', ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={`icon ${className}`} {...props} fill="currentColor">
      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
    </svg>
  );
}

export function AddIcon({ className = '', ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={`icon ${className}`} {...props} fill="currentColor">
      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
    </svg>
  );
}

export function DeleteIcon({ className = '', ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={`icon ${className}`} {...props} fill="currentColor">
      <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-9l-1 1H5v2h14V4z"/>
    </svg>
  );
}

export function EditIcon({ className = '', ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={`icon ${className}`} {...props} fill="currentColor">
      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z"/><path d="M20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
    </svg>
  );
}

export function ExpandMoreIcon({ className = '', ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={`icon ${className}`} {...props} fill="currentColor">
      <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"/>
    </svg>
  );
}

export function ChevronRightIcon({ className = '', ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={`icon ${className}`} {...props} fill="currentColor">
      <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z"/>
    </svg>
  );
}

export function FileCopyIcon({ className = '', ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={`icon ${className}`} {...props} fill="currentColor">
      <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
    </svg>
  );
}
