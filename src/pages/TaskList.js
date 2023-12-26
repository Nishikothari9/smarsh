import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useState, useEffect } from 'react';
// @mui
import {
  Card,
  Table,
  Stack,
  Paper,
  Button,
  Popover,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
  TableRow,
} from '@mui/material';
// components
// import Label from '../components/label';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';

// sections
import {TaskListHead} from '../sections/@dashboard/task';
import { useNavigate } from 'react-router-dom';
import TaskService from 'src/services/TaskService';
import { UserListToolbar } from 'src/sections/@dashboard/user';
// mock
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'details', label: 'Details', alignRight: false },
  { id: 'type', label: 'Task Type', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
  { id: '' },
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.details.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function TaskList() {
  const navigate = useNavigate();

  const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [TASKLIST, SETTASKLIST] = useState([]);

  const [selectedTaskId, setSelectedTaskId] = useState('');
  const [selectedTaskStatus,setSelectedTaskStatus] = useState('');
  const [selectedTaskType, setSelectedTaskType] = useState('');
  const [selectedTaskDetails, setSelectedTaskDetails] = useState('');
  const [selectedTaskEmployeeId, setSelectedTaskEmployeeId] = useState('');

   const getTasks = async () => {
     let taskInfo = [];
     const employeeData = JSON.parse(window.sessionStorage.getItem('userToken'));

     TaskService.getAllTasks(employeeData.id)
       .then((res) => {
         const leaveData = res.data.payload;
         if (leaveData.length > 0) {
           for (let i = 0; i < leaveData.length; i++) {
             const data = leaveData[i];
             taskInfo.push({
               id: data._id,
               status: data.status,
               details: employeeData.userRole === "hr" ? data.formatedDetails : data.details,
               type: data.type,
               employeeId: data.employeeId
             });
           }
           SETTASKLIST(taskInfo);
         }
       })
       .catch((error) => console.log(error));
   };

  useEffect(() => {
    getTasks();
  }, []);

  const handleOpenMenu = (event, id, status, details, type, employeeId) => {
    setSelectedTaskId(id);
    setSelectedTaskStatus(status);
    setSelectedTaskDetails(details);
    setSelectedTaskType(type);
    setSelectedTaskEmployeeId(employeeId);
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = TASKLIST.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - TASKLIST.length) : 0;

  const filteredUsers = applySortFilter(TASKLIST, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && !!filterName;

  const taskFinished = async(id, status, details, type, employeeId) => {
    TaskService.addOrUpdateTask({ id: id, status: status, details: details, type: type, employeeId: employeeId }, true)
    .then((res) => {
      getTasks();
      setOpen(false)
    })
    .catch((err) => {
      console.log(err);
    })
  }

  return (
    <>
      <Helmet>
        <title> Task | Smarsh Infotech </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            This month task List
          </Typography>
          <Button
            variant="contained"
            onClick={() => {
              navigate('/task/add');
            }}
            startIcon={<Iconify icon="eva:plus-fill" />}
          >
            New Task
          </Button>
        </Stack>

        <Card>
        <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <TaskListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={TASKLIST.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { id, details, type, status, employeeId } = row;
                    const selectedUser = selected.indexOf(id) !== -1;

                    return (
                      <TableRow hover key={id} tabIndex={-1} role="checkbox" selected={selectedUser}>
                        <TableCell align="left">
                          <div dangerouslySetInnerHTML={{ __html: details }}></div>
                        </TableCell>

                        <TableCell align="left">{type}</TableCell>

                        <TableCell align="left">
                          <p color={(status === 'banned' && 'error') || 'success'}>{sentenceCase(status)}</p>
                        </TableCell>

                        <TableCell align="right">
                          <IconButton size="large" color="inherit" onClick={(e) => handleOpenMenu(e, id, status, details, type, employeeId)}>
                            <Iconify icon={'eva:more-vertical-fill'} />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                {isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <Paper
                          sx={{
                            textAlign: 'center',
                          }}
                        >
                          <Typography variant="h6" paragraph>
                            Not found
                          </Typography>

                          <Typography variant="body2">
                            No results found for &nbsp;
                            <strong>&quot;{filterName}&quot;</strong>.
                            <br /> Try checking for typos or using complete words.
                          </Typography>
                        </Paper>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={TASKLIST.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 1,
            width: 140,
            '& .MuiMenuItem-root': {
              px: 1,
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <MenuItem onClick={() => navigate(`/task/edit/${selectedTaskId}`)}>
          <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem onClick={(e) => taskFinished(selectedTaskId, selectedTaskStatus === 'finished' ? 'created' : 'finished', selectedTaskDetails, selectedTaskType, selectedTaskEmployeeId)} sx={{ color: 'error.main' }}>
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
          {selectedTaskStatus === 'finished' ? "Re-create!" : "Finished"}
        </MenuItem>
      </Popover>
    </>
  );
}
