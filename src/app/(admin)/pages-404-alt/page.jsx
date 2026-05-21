import React from 'react';
import Link from 'next/link';
export const metadata = {
  title: '404 '
};
const page = () => {
  return <>
      <div className=" justify-content-center" style={{display:"flex",flexWrap:"wrap",gap:"16px"}}>
        <div>
          <div style={{background:"var(--surface)",border:"1px solid var(--line)",borderRadius:"var(--radius)",overflow:"hidden"}}>
            <div className=" px-3 py-5" style={{padding:"16px"}}>
              <div className="p-4">
                <div className="mx-auto mb-4 text-center">
                  <h1 className="mb-3 fw-bold fs-60">404</h1>
                  <h2 className="fs-22 lh-base">Page Not Found !</h2>
                  <p className="text-muted mt-1 mb-4">
                    The page you&apos;re trying to reach seems to have gone <br />
                    missing in the digital wilderness.
                  </p>
                  <div className="text-center">
                    <Link href="/dashboards" className="btn btn-success">
                      Back to Home
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>;
};
export default page;