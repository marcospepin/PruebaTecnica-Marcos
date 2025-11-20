import { headers } from 'next/headers';

export async function getLocale() {
  const headersList = await headers();
  return headersList.get('x-next-intl-locale') || 'es';
}
