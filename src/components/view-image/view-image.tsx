'use client';

import {
  GET_IMAGE_URL_BY_KEY,
  GetImageUrlByKeyResponse,
  GetImageUrlByKeyVariables,
} from '@/graphql';
import { useLazyQuery } from '@apollo/client/react';

import { Button } from '../ui/button';

type RenderType = React.ComponentProps<typeof Button>['render'];

interface ViewImageProps {
  imageKey: string;
  renderButton: RenderType;
  className?: string;
}

export default function ViewImage({ imageKey, renderButton, className }: ViewImageProps) {
  const [fetchUrl, { loading }] = useLazyQuery<GetImageUrlByKeyResponse, GetImageUrlByKeyVariables>(
    GET_IMAGE_URL_BY_KEY,
    { fetchPolicy: 'cache-and-network' },
  );

  const handleClick = async () => {
    const { data } = await fetchUrl({ variables: { key: imageKey } });
    const url = data?.getImageUrlByKey;
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Button
      nativeButton={false}
      render={renderButton}
      variant='outline'
      size='sm'
      disabled={loading}
      onClick={handleClick}
      className={className}
    />
  );
}
