import logoDark from '@/assets/images/Logo-primidigitals 1 (1).png';
import logoLight from '@/assets/images/Logo-primidigitals 1 (1).png';
import logoSm from '@/assets/images/Logo-primidigitals 1 (1).png';
import { useTheme } from '@/context/BrandingContext';
import Image from 'next/image';
import Link from 'next/link';

const LogoBox = () => {
  const { theme } = useTheme();

  console.log('themeColor', theme);

  return <div className="logo-box">
      {/* <Link href="/dashboards" className="logo-dark">
        <img width={28} height={28} src={logoSm} className="logo-sm" alt="logo sm" />
        <img width={98} height={30} src={theme?.logoUrl} className="logo-lg" alt="logo dark" />
      </Link> */}
      <Link href="/dashboards" className="logo-light">
        <img width={28} height={28} src={theme?.logoUrl || logoLight} className="logo-sm" alt="logo sm" />
        <img width={100} height={'auto'} src={theme?.logoUrl || logoLight} className="logo-lg" alt="logo light" />
      </Link>
    </div>;
};
export default LogoBox;