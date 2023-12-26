import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { Chip } from '@material-ui/core';
// components
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';

// sections
import ProjectService from 'src/services/ProjectService';
import PermissionService from 'src/services/PermissionService';
import { UserListToolbar } from '../sections/@dashboard/user';
import { ProjectListHead } from 'src/sections/@dashboard/project';
// mock
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'projectName', label: 'Project Name', alignRight: false },
  { id: 'description', label: 'Description', alignRight: false },
  { id: 'pm', label: 'Project Manager', alignRight: false },
  { id: 'startDate', label: 'Start Date', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
  { id: '' },
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
    return filter(array, (_user) => _user.projectName.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function ProjectList() {
  const navigate = useNavigate();

  const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [PROJECTLIST, SETPROJECTLIST] = useState([
    {
      projectName: 'test',
      description: 'test',
      pm: 'test',
      startDate: 'test',
      status: 'pending',
    },
  ]);

  const [selectedTicketId, setSelectedTicketId] = useState('');

  const [selectedTaskStatus, setSelectedTaskStatus] = useState('');

  const getProject = async () => {
    let projectInfo = [];
    const employeeData = JSON.parse(window.sessionStorage.getItem('userToken'));

    ProjectService.getAllProject()
      .then(async (res) => {
        const projectData = res.data.payload;
        if (projectData.length > 0) {
          for (let i = 0; i < projectData.length; i++) {
            const data = projectData[i];
            const pmFullName = await axios
              .get(`${process.env.REACT_APP_BACKEND_API_URL}/employee/getEmployeeDetails/${data.pmList[0].pmId}`)
              .then((res) => {
                return `${res.data.payload.firstName} ${res.data.payload.lastName}`;
              });
              
            projectInfo.push({
              id: data._id,
              projectName: data.projectName,
              employeeId: data.employeeId,
              description: data.description,
              pm: pmFullName,
              startDate: data.startDate,
              status: data.status,
            });
          }
          
          SETPROJECTLIST(projectInfo);
        }
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    getProject();
  }, []);

  const handleOpenMenu = (event, id, status) => {
    setSelectedTicketId(id);
    setSelectedTaskStatus(status);
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
      const newSelecteds = PROJECTLIST.map((n) => n.name);
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

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - PROJECTLIST.length) : 0;

  const filteredUsers = applySortFilter(PROJECTLIST, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && !!filterName;

  const valisUser = PermissionService.hasProjectEditAccess(JSON.parse(window.sessionStorage.getItem('userToken')).userRole);

  const taskFinished = async () => {
    await axios
      .delete(`${process.env.REACT_APP_BACKEND_API_URL}/project/delete/${selectedTicketId}`)
      .then(() => {
        getProject();
        setOpen(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <Helmet>
        <title> Task | Smarsh Infotech </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            This month Project List
          </Typography>
          {valisUser && <Button
            variant="contained"
            onClick={() => {
              navigate('/project/add');
            }}
            startIcon={<Iconify icon="eva:plus-fill" />}
          >
            New Project
          </Button>}
        </Stack>

        <Card>
        <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <ProjectListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={PROJECTLIST.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { id, status, projectName, description, pm, startDate } = row;
                    const selectedUser = selected.indexOf(id) !== -1;

                    const getSwitchColor = () => {
                      switch (status) {
                        case 'finished':
                          return 'primary';
                        case 'hold':
                          return 'secondary';
                        case 'process':
                          return 'default';
                        case 'pending':
                          return 'success';
                        case 'maintenance':
                          return 'info';
                        case 'rejected':
                          return 'error';
                      }
                    };

                    return (
                      <TableRow hover key={id} tabIndex={-1} role="checkbox" selected={selectedUser}>
                        <TableCell align="left">
                          <div dangerouslySetInnerHTML={{ __html: projectName }}></div>
                        </TableCell>
                        <TableCell align="left">
                          <div dangerouslySetInnerHTML={{ __html: description }}></div>
                        </TableCell>
                        <TableCell align="left">
                          <div dangerouslySetInnerHTML={{ __html: pm }}></div>
                        </TableCell>
                        <TableCell align="left">
                          <div dangerouslySetInnerHTML={{ __html: startDate }}></div>
                        </TableCell>
                        <TableCell align="left">
                          <Chip label={status} color={getSwitchColor()} />
                        </TableCell>
                        <Stack direction="row" spacing={1}></Stack>
                        {valisUser && <TableCell align="right">
                          <IconButton size="large" color="inherit" onClick={(e) => handleOpenMenu(e, id, status)}>
                            <Iconify icon={'eva:more-vertical-fill'} />
                          </IconButton>
                        </TableCell>}
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
            count={PROJECTLIST.length}
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
        <MenuItem onClick={() => navigate(`/project/edit/${selectedTicketId}`)}>
          <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem onClick={() => taskFinished()} sx={{ color: 'error.main' }}>
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>
    </>
  );
}
