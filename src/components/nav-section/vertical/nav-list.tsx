/* eslint-disable @typescript-eslint/no-explicit-any */
import { useBoolean } from "minimal-shared/hooks";
import { useRef, useEffect, useCallback } from "react";
import { isActiveLink, isExternalLink } from "minimal-shared/utils";

import { usePathname } from "@/routes/hooks";

import { NavItem } from "./nav-item";
import { navSectionClasses } from "../styles";
import { NavUl, NavLi, NavCollapse } from "../components";
// import { SxProps } from '@mui/material/styles';

// ----------------------------------------------------------------------

export interface NavListProps {
  data: {
    title: string;
    path?: any;
    icon?: React.ReactNode;
    children?: any[];
    info?: any;
    caption?: string;
    disabled?: boolean;
    allowedRoles?: string[];
  };
  depth?: any;
  render?: string;
  slotProps?: {
    rootItem?: Record<string, any>;
    subItem?: Record<string, any>;
  };
  checkPermissions?: (roles: string[]) => boolean;
  enabledRootRedirect?: boolean;
}

export function NavList({
  data,
  depth,
  render,
  slotProps,
  checkPermissions,
  enabledRootRedirect,
}: NavListProps) {
  const pathname = usePathname();
  const navItemRef = useRef(null);

  const isActive = isActiveLink(pathname, data.path, !!data.children);

  const { value: open, onFalse: onClose, onToggle } = useBoolean(isActive);

  useEffect(() => {
    if (!isActive) {
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const handleToggleMenu = useCallback(() => {
    if (data.children) {
      onToggle();
    }
  }, [data.children, onToggle]);

  const renderNavItem = () => (
    <NavItem
      ref={navItemRef}
      // slots
      path={data.path}
      icon={data.icon}
      info={data.info}
      title={data.title}
      caption={data.caption}
      // state
      open={open}
      active={isActive}
      disabled={data.disabled}
      // options
      depth={depth}
      render={render}
      hasChild={!!data.children}
      externalLink={isExternalLink(data.path)}
      enabledRootRedirect={enabledRootRedirect}
      // styles
      slotProps={depth === 1 ? slotProps?.rootItem : slotProps?.subItem}
      // actions
      onClick={handleToggleMenu}
    />
  );

  const renderCollapse = () =>
    !!data.children && (
      <NavCollapse
        mountOnEnter
        unmountOnExit
        depth={depth}
        in={open}
        data-group={data.title}
      >
        <NavSubList
          data={data.children}
          render={render}
          depth={depth}
          slotProps={slotProps}
          checkPermissions={checkPermissions}
          enabledRootRedirect={enabledRootRedirect}
        />
      </NavCollapse>
    );

  // Hidden item by role
  if (
    data.allowedRoles &&
    checkPermissions &&
    checkPermissions(data.allowedRoles)
  ) {
    return null;
  }

  return (
    <NavLi
      disabled={data.disabled}
      sx={{
        ...(!!data.children && {
          [`& .${navSectionClasses.li}`]: {
            "&:first-of-type": { mt: "var(--nav-item-gap)" },
          },
        }),
      }}
    >
      {renderNavItem()}
      {renderCollapse()}
    </NavLi>
  );
}

// ----------------------------------------------------------------------
interface NavSubListProps {
  data: any[];
  render?: string;
  depth?: number;
  slotProps?: {
    rootItem?: Record<string, any>;
    subItem?: Record<string, any>;
  };
  checkPermissions?: (roles: string[]) => boolean;
  enabledRootRedirect?: boolean;
}

function NavSubList({
  data,
  render,
  depth = 0,
  slotProps,
  checkPermissions,
  enabledRootRedirect,
}: NavSubListProps) {
  return (
    <NavUl sx={{ gap: "var(--nav-item-gap)" }}>
      {data.map((list: any) => (
        <NavList
          key={list.title}
          data={list}
          render={render}
          depth={depth + 1}
          slotProps={slotProps}
          checkPermissions={checkPermissions}
          enabledRootRedirect={enabledRootRedirect}
        />
      ))}
    </NavUl>
  );
}
