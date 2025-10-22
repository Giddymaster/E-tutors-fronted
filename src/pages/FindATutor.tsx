import React from 'react';
import { Box, Typography, TextField, Button, Grid, Card, CardContent } from '@mui/material';

export default function FindATutor() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Find a Tutor
      </Typography>

      <Box component="form" sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField label="Subject or keyword" fullWidth />
        <Button variant="contained">Search</Button>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Sample Tutor — Jane Doe</Typography>
              <Typography variant="body2" color="text.secondary">
                Subjects: Math, Physics — Rating: 4.9
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        {/* add real cards / list mapping when data is available */}
      </Grid>
    </Box>
  );
}