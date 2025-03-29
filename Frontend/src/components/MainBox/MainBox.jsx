import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import VideoDisplay from '../VideoDisplay/VideoDisplay';
import CodeDisplay from '../CodeDisplay/CodeDisplay';
import VideoIcons from '../VideoIcons/VideoIcons';
import Navbar from '../Navbar/Navbar';
import ContextAPI from '../ContextAPI/ContextAPI';


const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: (theme.vars ?? theme).palette.text.secondary,
  ...theme.applyStyles('dark', {
    backgroundColor: '#1A2027',
  }),
}));

export default function MainBox() {

  const [ isCode, setIsCode ] = React.useState(true);

  return (
    <ContextAPI.Provider value={ {isCode, setIsCode} } >
      <Box sx={{ flexGrow: 1 }}>
      <div className="main-box">
      <Navbar />
      <Grid container spacing={3} sx={ { mt: 10 } } >
        <Grid size={  (isCode)?'grow':12  }>
          <VideoDisplay />
        </Grid>
        <Grid sx={ { width: (isCode)?700:400 } }>
          <CodeDisplay />
        </Grid>
      </Grid>
      <Grid container spacing={3} >
        <Grid size="grow" >
          <VideoIcons />
        </Grid>
      </Grid>
      </div>
      <div>

      </div>
      </Box>
    </ContextAPI.Provider>
  );
}
