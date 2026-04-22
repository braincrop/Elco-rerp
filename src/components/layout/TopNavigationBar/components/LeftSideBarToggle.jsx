'use client';
import React, { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useLayoutContext } from '@/context/useLayoutContext';
import IconifyIcon from '@/components/wrapper/IconifyIcon';
import useViewPort from '@/hooks/useViewPort';

const TABLET_BREAKPOINT = 1140; // width at which sidebar auto-hides

const LeftSideBarToggle = () => {
  const { menu: { size }, changeMenu: { size: changeMenuSize }, toggleBackdrop } = useLayoutContext();
  const pathname = usePathname();
  const { width } = useViewPort();
  const isFirstRender = useRef(true);

  const handleMenuSize = () => {
    if (size === 'hidden') {
      toggleBackdrop();
      changeMenuSize('default'); // show default if hidden
    } else if (size === 'condensed') {
      changeMenuSize('default');
    } else {
      changeMenuSize('condensed');
    }
  };

  // Auto-hide sidebar on small/tablet screens
  useEffect(() => {
    if (width <= TABLET_BREAKPOINT && size !== 'hidden') {
      changeMenuSize('hidden');
    }
    // Only open automatically when resizing above breakpoint
    else if (width > TABLET_BREAKPOINT && size === 'hidden') {
      changeMenuSize('default');
    }
  }, [width]);

  // Optional: hide sidebar on route change if width small
  useEffect(() => {
    if (width <= TABLET_BREAKPOINT) {
      changeMenuSize('hidden');
    }
  }, [pathname]);

  return (
    <div className="topbar-item">
      <button type="button" onClick={handleMenuSize} className="button-toggle-menu topbar-button" style={{backgroundColor:'transparent'}}>
        <IconifyIcon
          icon="solar:hamburger-menu-outline"
          width={24}
          height={24}
          className="fs-24 align-middle"
        />
      </button>
    </div>
  );
};

export default LeftSideBarToggle;
