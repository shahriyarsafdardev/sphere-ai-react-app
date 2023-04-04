import { TextField, InputAdornment, Stack, IconButton } from '@material-ui/core';
import { memo } from 'react';
import searchFill from '@iconify/icons-eva/search-fill';
import { Icon } from '@iconify/react';

const SearchBar = memo(
  ({
    searchQuery,
    setSearchQuery,
    placeHolder,
    submitHandler,
    disableButton
  }: {
    searchQuery: string;
    setSearchQuery: Function;
    placeHolder: string;
    submitHandler: Function;
    disableButton?: boolean;
  }) => {
    const handleKeyDown = (e: any) => {
      if (submitHandler && e?.key === 'Enter' && !disableButton) {
        submitHandler();
        e?.preventDefault();
      }
    };
    return (
      <Stack direction="row" alignItems="center">
        <TextField
          fullWidth
          placeholder={placeHolder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => handleKeyDown(e)}
          InputProps={{
            style: { background: '#ffffff' },
            startAdornment: (
              <InputAdornment position="start">
                <Icon
                  style={{ marginLeft: '5px' }}
                  icon={searchFill}
                  width={25}
                  height={25}
                  color="#101658"
                />
              </InputAdornment>
            )
          }}
          color="primary"
        />
        {submitHandler && (
          <IconButton
            sx={{ width: '50px', height: '50px' }}
            onClick={() => submitHandler()}
            disabled={disableButton}
          >
            <img width="24" src="/static/icons/ic-send.svg" alt="search" />
          </IconButton>
        )}
      </Stack>
    );
  }
);

export default SearchBar;
