import * as React from 'react';
import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DropDownControl from '../common/DropDownControl';
import TextFieldControl from './TextFieldControl';
import { Button, TextField } from '@mui/material'
import { Stack } from '@material-ui/core';
import TeamLeadList from '../_dashboard/Project/TeamLeadList';
import EmployeeList from '../_dashboard/Project/EmployeeListDropDown';
import ProjectManagerList from '../_dashboard/Project/ProjectManagerList';
import HRList from '../_dashboard/Project/HRList';
import ClientList from '../_dashboard/Project/ClientList';

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&:before': {
    display: 'none',
  },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, .05)'
      : 'rgba(0, 0, 0, .03)',
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)',
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

export default function CustomizedAccordions({title, lookUp}) {
  
  return (
      <>
        {/* <Typography variant="h6">Employee List</Typography> */}
          <Accordion >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>{title}</Typography>
            </AccordionSummary>
            {/* <Button>Add Button</Button> */}
            <AccordionDetails>
              {title === "Team Leader List" && lookUp.length && <TeamLeadList lookUp={lookUp}/>}
              {title === "Project Manager List" && lookUp.length && <ProjectManagerList lookUp={lookUp}/>}
              {title === "Employee List" && lookUp.length && <EmployeeList lookUp={lookUp}/>}
              {title === "HR List" && lookUp.length && <HRList lookUp={lookUp}/>}
              {title === "Client List" &&  <ClientList />}
            </AccordionDetails>
          </Accordion>
      </>
  );
}