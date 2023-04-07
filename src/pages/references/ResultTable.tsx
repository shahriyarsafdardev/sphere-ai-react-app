import Scrollbar from 'components/Scrollbar';
import { memo } from 'react';
import {
  Table,
  TableBody,
  TableContainer,
  TableRow,
  TableCell,
  TableHead
} from '@material-ui/core';

type ResultTableHeadProps = {
  order: 'asc' | 'desc';
  orderBy: string;
  rowCount: number;
  headLabel: any[];
  numSelected?: number;
  onRequestSort: (id: string) => void;
  onSelectAllClick?: (checked: boolean) => void;
};

const titleCase = (s: string) =>
  s.replace(/^_*(.)|_+(.)/g, (s, c, d) => (c ? c.toUpperCase() : ` ${d.toUpperCase()}`));

const ResultTableHead = ({
  order,
  orderBy,
  rowCount,
  headLabel,
  numSelected,
  onRequestSort,
  onSelectAllClick
}: ResultTableHeadProps) => (
  <TableHead>
    <TableRow>
      {headLabel.map((headCell) => (
        <TableCell key={headCell.id} align={headCell.align || 'left'}>
          {titleCase(headCell.label)}
        </TableCell>
      ))}
    </TableRow>
  </TableHead>
);

function ResultTable({ queryResult }: { queryResult: any }) {
  const tableHead = () =>
    Object.keys(queryResult[0]).map((item: any) => ({ id: item, label: item, align: 'left' }));

  return (
    <Scrollbar>
      <TableContainer sx={{ minWidth: 800 }}>
        <Table>
          <ResultTableHead
            order="asc"
            orderBy="time"
            headLabel={tableHead()}
            rowCount={queryResult.length}
            numSelected={0}
            onRequestSort={() => {}}
          />
          <TableBody id="registration-list-container">
            {queryResult.map((result: any) => (
              <TableRow hover key={result.id} tabIndex={-1}>
                {Object.keys(result).map((item) => (
                  <TableCell key={result} style={{ width: 150 }} align="left">
                    {result[item]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Scrollbar>
  );
}

export default memo(ResultTable);
