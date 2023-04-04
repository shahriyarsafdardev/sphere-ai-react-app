import { memo } from 'react';
import { Icon } from '@iconify/react';
import arrowIosDownwardFill from '@iconify/icons-eva/arrow-ios-downward-fill';
import arrowIosUpwardFill from '@iconify/icons-eva/arrow-ios-upward-fill';
import { IconButton } from '@material-ui/core';

function ShowMoreButton({ more, setMore }: { more: boolean; setMore: Function }) {
  return (
    <IconButton onClick={() => setMore(!more)}>
      {more ? (
        <Icon icon={arrowIosUpwardFill} width={20} height={20} />
      ) : (
        <Icon icon={arrowIosDownwardFill} width={20} height={20} />
      )}
    </IconButton>
  );
}

export default memo(ShowMoreButton);
