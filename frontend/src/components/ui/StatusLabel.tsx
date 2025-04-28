// components/StatusLabel.tsx
import React from 'react';

interface StatusLabelProps {
    status: string;
    styles: {
        statusBase: string;
        statusActive: string;
        statusInactive: string;
    };
}

export const StatusLabel: React.FC<StatusLabelProps> = ({ status, styles }) => {
    return (
        <span className={`${styles.statusBase} ${
            status === 'active'
                ? styles.statusActive
                : styles.statusInactive
        }`}>
      {status}
    </span>
    );
};