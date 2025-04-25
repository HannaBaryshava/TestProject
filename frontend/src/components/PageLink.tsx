//useless
import { HTMLProps } from 'react';
export type Props = HTMLProps<HTMLAnchorElement> & {
    active?: boolean;
    disabled?: boolean;
};

export default function PageLink({
                                     className,
                                     active,
                                     disabled,
                                     children,
                                     ...otherProps
                                 }: Props) {

    const baseStyles = 'relative inline-flex border bg-white text-orange-400 font-medium no-underline cursor-pointer  px-3 py-1.5 text-sm  md:px-3.5 md:py-2 md:text-base lg:px-4 lg:py-2 border-solid border-grey-400 focus:outline-none focus:ring-2 focus:ring-orange-200 transition duration-300';
    // Состояния
    const hoverFocusStyles = 'hover:bg-orange-50 hover:text-orange-500 focus:bg-orange-50';
    const activeStyles = '!text-white !bg-orange-400 hover:bg-orange-400';
    const disabledStyles = '!text-gray-400 border-gray-300 pointer-events-none hover:bg-white';

    // Отступ для не-первого элемента
    const notFirstStyles = ' [&:not(:first-child)]:-ml-0.5\n' +
        '  md:[&:not(:first-child)]:-ml-px';

    const pageLinkStyles = [
        baseStyles,
        !disabled && hoverFocusStyles,
        active && activeStyles,
        disabled && disabledStyles,
        notFirstStyles,
        className
    ].filter(Boolean).join(' ');


    if (disabled) {
        return (
            <span className={pageLinkStyles}>
        {children}
      </span>
        );
    }

    return (
        <a
            className={pageLinkStyles}
            aria-current={active ? 'page' : undefined}
            {...otherProps}
        >
            {children}
        </a>
    );
}