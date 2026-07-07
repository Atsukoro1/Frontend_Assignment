"use client";

import { PawPrint } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

const Bar = styled.header`
  position: sticky;
  top: 0;
  z-index: 10;
  background: color-mix(in srgb, ${({ theme }) => theme.colors.background} 88%, transparent);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const Inner = styled.div`
  max-width: 44rem;
  margin: 0 auto;
  padding: ${({ theme }) => `${theme.space.sm} ${theme.space.md}`};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space.md};
`;

const Logo = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.xs};
  color: ${({ theme }) => theme.colors.heading};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: 800;
  text-decoration: none;
`;

const LogoBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.textOnPrimary};
`;

const Nav = styled.nav`
  display: flex;
  gap: ${({ theme }) => theme.space.xxs};
`;

const NavLink = styled(Link)<{ $active: boolean }>`
  padding: ${({ theme }) => `${theme.space.xxs} ${theme.space.sm}`};
  border-radius: ${({ theme }) => theme.radii.pill};
  font-weight: 700;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  text-decoration: none;
  color: ${({ theme, $active }) => ($active ? theme.colors.heading : theme.colors.textMuted)};
  background: ${({ theme, $active }) => ($active ? theme.colors.primarySoft : "transparent")};
  transition:
    background ${({ theme }) => theme.transitions.fast},
    color ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.heading};
    background: ${({ theme }) => theme.colors.primarySoft};
  }
`;

export function Header() {
  const { t } = useTranslation();
  const pathname = usePathname();

  return (
    <Bar>
      <Inner>
        <Logo href="/">
          <LogoBadge aria-hidden="true">
            <PawPrint size={20} />
          </LogoBadge>
          {t("app.name")}
        </Logo>
        <Nav aria-label={t("app.name")}>
          <NavLink href="/" $active={pathname === "/"}>
            {t("nav.donate")}
          </NavLink>
          <NavLink href="/kontakt" $active={pathname === "/kontakt"}>
            {t("nav.contact")}
          </NavLink>
        </Nav>
      </Inner>
    </Bar>
  );
}
