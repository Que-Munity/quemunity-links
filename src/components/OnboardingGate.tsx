'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import OnboardingModal from './OnboardingModal';

export default function OnboardingGate() {
  const { data: session, status } = useSession();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (status !== 'authenticated' || !session?.user?.id) return;
    fetch('/api/profile')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data && data.onboardingDone === false) {
          setShow(true);
        }
      })
      .catch(() => {});
  }, [status, session]);

  if (!show) return null;
  return <OnboardingModal onClose={() => setShow(false)} />;
}
