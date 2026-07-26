import { useEffect, useState } from "react";

import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Chip,
} from "@mui/material";

import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import BadgeIcon from "@mui/icons-material/Badge";

import api from "../../api/axios";

export default function Users() {

  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);



  useEffect(() => {

    loadUsers();

  }, []);




  const loadUsers = async () => {

    try {

      setLoading(true);

      const res = await api.get("/users");

      setUsers(
        Array.isArray(res.data)
          ? res.data
          : []
      );

    } catch (err) {

      console.log(
        "Users fetch error:",
        err
      );

      setUsers([]);

    } finally {

      setLoading(false);

    }

  };





  const totalUsers = users.length;

  const admins = users.filter(
    (u) =>
      u.role?.toLowerCase() === "admin"
  ).length;

  const managers = users.filter(
    (u) =>
      u.role?.toLowerCase() === "manager"
  ).length;

  const staff = users.filter(
    (u) =>
      u.role?.toLowerCase() === "staff"
  ).length;





  if (loading) {

    return (

      <Box
        sx={{
          height: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >

        <CircularProgress />

      </Box>

    );

  }





  return (

    <Box sx={{ width: "100%" }}>

      {/* HEADER */}

      <Box sx={{ mb: 3 }}>

        <Typography
          variant="h5"
          fontWeight={800}
        >

          User Management

        </Typography>

        <Typography
          color="text.secondary"
        >

          View all registered system users

        </Typography>

      </Box>
            {/* KPI CARDS */}

      <Grid
        container
        spacing={3}
        sx={{ mb: 3 }}
      >

        {/* TOTAL USERS */}

        <Grid
          item
          xs={12}
          md={3}
        >

          <Card
            sx={{
              borderRadius: 3,
            }}
          >

            <CardContent>

              <Typography
                color="text.secondary"
              >

                Total Users

              </Typography>

              <Typography
                variant="h5"
                fontWeight={800}
              >

                {totalUsers}

              </Typography>

            </CardContent>

          </Card>

        </Grid>



        {/* ADMINS */}

        <Grid
          item
          xs={12}
          md={3}
        >

          <Card
            sx={{
              borderRadius: 3,
            }}
          >

            <CardContent>

              <Typography
                color="text.secondary"
              >

                Admins

              </Typography>

              <Typography
                variant="h5"
                fontWeight={800}
                color="error.main"
              >

                {admins}

              </Typography>

            </CardContent>

          </Card>

        </Grid>



        {/* MANAGERS */}

        <Grid
          item
          xs={12}
          md={3}
        >

          <Card
            sx={{
              borderRadius: 3,
            }}
          >

            <CardContent>

              <Typography
                color="text.secondary"
              >

                Managers

              </Typography>

              <Typography
                variant="h5"
                fontWeight={800}
                color="primary.main"
              >

                {managers}

              </Typography>

            </CardContent>

          </Card>

        </Grid>



        {/* STAFF */}

        <Grid
          item
          xs={12}
          md={3}
        >

          <Card
            sx={{
              borderRadius: 3,
            }}
          >

            <CardContent>

              <Typography
                color="text.secondary"
              >

                Staff

              </Typography>

              <Typography
                variant="h5"
                fontWeight={800}
                color="success.main"
              >

                {staff}

              </Typography>

            </CardContent>

          </Card>

        </Grid>

      </Grid>
            {/* USERS TABLE */}

      <Box
        sx={{
          mt: 2,
          overflowX: "auto",
        }}
      >

        {/* TABLE HEADER */}

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 2fr 2fr 1fr",
            fontWeight: 800,
            p: 2,
            bgcolor: "#f1f5f9",
            borderRadius: 2,
            minWidth: 900,
          }}
        >

          <Box>ID</Box>

          <Box>Name</Box>

          <Box>Email</Box>

          <Box>Role</Box>

        </Box>



        {/* TABLE ROWS */}

        {users.map((user) => (

          <Box
            key={user.id}
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 2fr 2fr 1fr",
              p: 2,
              borderBottom: "1px solid #e2e8f0",
              alignItems: "center",
              minWidth: 900,
              "&:hover": {
                bgcolor: "#f8fafc",
              },
            }}
          >

            {/* ID */}

            <Box
              sx={{
                fontWeight: 700,
              }}
            >

              #{user.id}

            </Box>



            {/* NAME */}

            <Box>

              {user.name}

            </Box>



            {/* EMAIL */}

            <Box>

              {user.email}

            </Box>



            {/* ROLE */}

            <Box>

              <Chip
                icon={
                  user.role?.toLowerCase() === "admin" ? (
                    <AdminPanelSettingsIcon />
                  ) : user.role?.toLowerCase() === "manager" ? (
                    <SupervisorAccountIcon />
                  ) : (
                    <BadgeIcon />
                  )
                }
                label={user.role}
                color={
                  user.role?.toLowerCase() === "admin"
                    ? "error"
                    : user.role?.toLowerCase() === "manager"
                    ? "primary"
                    : "success"
                }
                size="small"
              />

            </Box>

          </Box>

        ))}
              </Box>



      {/* EMPTY STATE */}

      {users.length === 0 && (

        <Box
          sx={{
            textAlign: "center",
            py: 6,
          }}
        >

          <Typography
            color="text.secondary"
          >

            No users found

          </Typography>

        </Box>

      )}



    </Box>

  );

}
