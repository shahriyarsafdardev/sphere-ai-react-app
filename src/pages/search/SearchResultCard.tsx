import { memo, useState } from 'react';
import moment from 'moment';
import { Typography, Stack } from '@material-ui/core';
import ShowMoreButton from 'components/common/ShowMoreButton';
import { SearchCard, useStyles, StyledButton, StyledListItem } from './Common';

function SearchResultCard({
  searchResult,
  searchQuery
}: {
  searchResult: any;
  searchQuery: string;
}) {
  const [more, setMore] = useState(false);
  const classes = useStyles();

  return (
    <SearchCard spacing={{ xs: 4, md: 2 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={{ xs: 1, md: 2 }}>
          <Typography className={classes.title}>
            {searchResult.company_name} | {searchResult.title}
          </Typography>
          <Typography className={classes.publishDate}>
            {moment(searchResult.publish_date).format('MMM D, YYYY')}
          </Typography>
        </Stack>
        <ShowMoreButton more={more} setMore={setMore} />
      </Stack>
      <ol>
        {more &&
          searchResult.matches.map((match: any, index: any) =>
            match.page_matches.map((text: string, index2: any) => (
              <StyledListItem key={match.page_number + index}>
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={1}
                  justifyContent="space-between"
                  alignItems={{ xs: 'left', sm: 'center' }}
                >
                  <Stack direction="row">
                    <Typography sx={{}} className={classes.mainText}>
                      "...&nbsp;{text}
                    </Typography>
                    "
                  </Stack>
                  <StyledButton
                    variant="outlined"
                    onClick={() => window.open(searchResult.url, '_blank')}
                  >
                    Open page {match.page_number}
                  </StyledButton>
                </Stack>
              </StyledListItem>
            ))
          )}
      </ol>
    </SearchCard>
  );
}

export default memo(SearchResultCard);
