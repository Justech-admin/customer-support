// import React, { useState, useEffect } from 'react';
// import { Box, Container, Typography, Grid, Card, CardContent } from '@mui/material';
// import Sidebaradmin from '@/components/Sidebaradmin';

// const Dashboard = () => {
//    const [stats, setStats] = useState({
//       totalTickets: 0,
//       openTickets: 0,
//       resolvedTickets: 0,
//       averageResponseTime: 0
//    });

//    useEffect(() => {
//       // Fetch dashboard statistics here
//       // Example: fetchDashboardStats().then(data => setStats(data));
//    }, []);

//    return (
//       <Container maxWidth="lg">
//          <Sidebaradmin />
//          <Box sx={{ py: 4 }}>
//             <Typography variant="h4" gutterBottom>
//                Admin Dashboard
//             </Typography>
            
//             <Grid container spacing={3}>
//                <Grid item xs={12} sm={6} md={3}>
//                   <Card>
//                      <CardContent>
//                         <Typography color="textSecondary" gutterBottom>
//                            Total Tickets
//                         </Typography>
//                         <Typography variant="h5">
//                            {stats.totalTickets}
//                         </Typography>
//                      </CardContent>
//                   </Card>
//                </Grid>

//                <Grid item xs={12} sm={6} md={3}>
//                   <Card>
//                      <CardContent>
//                         <Typography color="textSecondary" gutterBottom>
//                            Open Tickets
//                         </Typography>
//                         <Typography variant="h5">
//                            {stats.openTickets}
//                         </Typography>
//                      </CardContent>
//                   </Card>
//                </Grid>

//                <Grid item xs={12} sm={6} md={3}>
//                   <Card>
//                      <CardContent>
//                         <Typography color="textSecondary" gutterBottom>
//                            Resolved Tickets
//                         </Typography>
//                         <Typography variant="h5">
//                            {stats.resolvedTickets}
//                         </Typography>
//                      </CardContent>
//                   </Card>
//                </Grid>

//                <Grid item xs={12} sm={6} md={3}>
//                   <Card>
//                      <CardContent>
//                         <Typography color="textSecondary" gutterBottom>
//                            Avg. Response Time
//                         </Typography>
//                         <Typography variant="h5">
//                            {stats.averageResponseTime}h
//                         </Typography>
//                      </CardContent>
//                   </Card>
//                </Grid>
//             </Grid>
//          </Box>
//       </Container>
//    );
// };

// export default Dashboard;

