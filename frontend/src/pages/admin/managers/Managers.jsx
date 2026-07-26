import { useEffect, useMemo, useState } from "react";

import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutlined";
import RefreshIcon from "@mui/icons-material/Refresh";
import PersonIcon from "@mui/icons-material/Person";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import DeleteIcon from "@mui/icons-material/Delete";

import {
  createManager,
  getManagers,
  deleteManager,
} from "../../../api/manager.api";

import api from "../../../api/axios";

import PageHeader from "../../../components/common/PageHeader";
import StatCard from "../../../components/common/StatCard";
import DashboardSkeleton from "../../../components/common/DashboardSkeleton";


export default function Managers() {

  const [managers, setManagers] = useState([]);
  const [warehouses, setWarehouses] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [open, setOpen] = useState(false);

  const [search, setSearch] = useState("");

  const [deleteTarget, setDeleteTarget] = useState(null);


  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    warehouse_id: "",
  });


  // ---------------- LOAD DATA ----------------

  const load = async () => {

    try {

      setLoading(true);
      setError(null);

      const [managerData, warehouseData] =
        await Promise.all([
          getManagers(),
          api.get("/warehouses/"),
        ]);


      setManagers(
        Array.isArray(managerData)
          ? managerData
          : []
      );


      setWarehouses(
        Array.isArray(warehouseData.data)
          ? warehouseData.data
          : []
      );


    } catch (err) {

      console.log(err);

      setError(
        err.response?.data?.message ||
        "Failed to load managers"
      );

      setManagers([]);
      setWarehouses([]);

    } finally {

      setLoading(false);

    }
  };


  useEffect(() => {
    load();
  }, []);



  // ---------------- SEARCH ----------------

  const filtered = useMemo(() => {

    const q = search
      .toLowerCase()
      .trim();


    if (!q) return managers;


    return managers.filter((m) =>
      `${m.name}
       ${m.email}
       ${m.role}
       ${m.warehouse_id}`
        .toLowerCase()
        .includes(q)
    );


  }, [search, managers]);



  // ---------------- CREATE MANAGER ----------------

  const handleCreate = async () => {

    try {

      await createManager(form);


      setForm({
        name: "",
        email: "",
        password: "",
        warehouse_id: "",
      });


      setOpen(false);

      load();


    } catch (err) {

      console.log(err);

      alert("Failed to create manager");

    }

  };



  // ---------------- DELETE MANAGER ----------------

  const handleDelete = async () => {

    try {

      await deleteManager(deleteTarget.id);

      setDeleteTarget(null);

      load();


    } catch (err) {

      console.log(err);

      alert("Failed to delete manager");

    }

  };



  const cards = [

    {
      label: "Total Managers",
      value: managers.length,
      icon: (
        <PersonIcon sx={{ fontSize: 30 }} />
      ),
      gradient:
        "linear-gradient(135deg,#1976d2,#42a5f5)",
    },


    {
      label: "Assigned Managers",
      value:
        managers.filter(
          (m) => m.warehouse_id
        ).length,

      icon: (
        <WarehouseIcon sx={{ fontSize: 30 }} />
      ),

      gradient:
        "linear-gradient(135deg,#16a34a,#4ade80)",
    },


    {
      label: "Unassigned",
      value:
        managers.filter(
          (m) => !m.warehouse_id
        ).length,

      icon: (
        <AssignmentIndIcon
          sx={{ fontSize: 30 }}
        />
      ),

      gradient:
        "linear-gradient(135deg,#f59e0b,#fbbf24)",
    },

  ];
    if (loading) {
    return <DashboardSkeleton cardCount={3} />;
  }


  if (error) {
    return (
      <Box
        sx={{
          textAlign: "center",
          py: 10,
        }}
      >

        <ErrorOutlineIcon
          sx={{
            fontSize: 48,
            color: "error.main",
            mb: 2,
          }}
        />

        <Typography
          color="error"
          fontWeight={600}
        >
          {error}
        </Typography>


        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={load}
          sx={{ mt: 2 }}
        >
          Retry
        </Button>

      </Box>
    );
  }


  return (
    <Box>


      {/* PAGE HEADER */}

      <PageHeader
        title="Manager Management"
        subtitle="Create, assign and manage warehouse managers"
      />


      {/* ACTION BUTTON */}

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          mb: 3,
        }}
      >

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpen(true)}
        >
          Create Manager
        </Button>

      </Box>
      {/* STAT CARDS */}

      <Box sx={{ mb: 4 }}>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(250px,1fr))",
            gap: 3,
          }}
        >

          {cards.map((card) => (

            <StatCard
              key={card.label}
              {...card}
            />

          ))}

        </Box>

      </Box>




      {/* SEARCH AREA */}

      <Box
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 3,
          bgcolor: "background.paper",
          boxShadow: 2,
          display: "flex",
          gap: 2,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >

        <TextField
          size="small"
          placeholder="Search managers..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          sx={{
            minWidth: 280,
            flex: 1,
          }}
        />


        <Box>
          <Typography
            variant="body2"
            color="text.secondary"
          >
            Showing {filtered.length} of{" "}
            {managers.length} managers
          </Typography>
        </Box>


      </Box>




      {/* TABLE */}

      <Box
        sx={{
          overflowX: "auto",
        }}
      >

        <Box
          component="table"
          sx={{
            width: "100%",
            borderCollapse: "collapse",
            minWidth: 800,
            bgcolor: "#fff",
            borderRadius: 3,
            boxShadow: 3,
            overflow: "hidden",
          }}
        >


          {/* TABLE HEADER */}

          <Box
            component="thead"
            sx={{
              bgcolor: "#f1f5f9",
            }}
          >

            <Box component="tr">

              {[
                "Name",
                "Email",
                "Role",
                "Warehouse",
                "Action",
              ].map((header) => (

                <Box
                  component="th"
                  key={header}
                  sx={{
                    textAlign: "left",
                    p: 2,
                    fontWeight: 700,
                    color: "#334155",
                    borderBottom:
                      "1px solid #e2e8f0",
                  }}
                >

                  {header}

                </Box>

              ))}

            </Box>

          </Box>



          {/* TABLE BODY START */}

          <Box component="tbody">
                        {filtered.map((manager) => (
              <Box
                component="tr"
                key={manager.id}
                sx={{
                  "&:hover": {
                    backgroundColor: "#f8fafc",
                  },
                }}
              >

                {/* NAME */}
                <Box
                  component="td"
                  sx={{
                    p: 2,
                    borderBottom:
                      "1px solid #e2e8f0",
                    fontWeight: 600,
                  }}
                >
                  {manager.name || "Unnamed"}
                </Box>



                {/* EMAIL */}
                <Box
                  component="td"
                  sx={{
                    p: 2,
                    borderBottom:
                      "1px solid #e2e8f0",
                  }}
                >
                  {manager.email}
                </Box>



                {/* ROLE */}
                <Box
                  component="td"
                  sx={{
                    p: 2,
                    borderBottom:
                      "1px solid #e2e8f0",
                  }}
                >
                  <Chip
                    label={
                      manager.role || "Manager"
                    }
                    color="primary"
                    size="small"
                  />
                </Box>



                {/* WAREHOUSE */}
                <Box
                  component="td"
                  sx={{
                    p: 2,
                    borderBottom:
                      "1px solid #e2e8f0",
                  }}
                >
                  <Chip
                    label={
                      manager.warehouse_id
                        ? `Warehouse ${manager.warehouse_id}`
                        : "Not Assigned"
                    }
                    color={
                      manager.warehouse_id
                        ? "success"
                        : "warning"
                    }
                    size="small"
                  />
                </Box>



                {/* ACTION */}
                <Box
                  component="td"
                  sx={{
                    p: 2,
                    borderBottom:
                      "1px solid #e2e8f0",
                  }}
                >
                  <Button
                    color="error"
                    variant="outlined"
                    size="small"
                    startIcon={<DeleteIcon />}
                    onClick={() =>
                      setDeleteTarget(manager)
                    }
                  >
                    Delete
                  </Button>
                </Box>


              </Box>
            ))}

          </Box>

        </Box>

      </Box>



      {/* EMPTY STATE */}

      {filtered.length === 0 && (

        <Box
          sx={{
            textAlign: "center",
            py: 8,
          }}
        >

          <Typography
            color="text.secondary"
            fontWeight={600}
          >
            No managers found
          </Typography>

        </Box>

      )}





      {/* CREATE MANAGER DIALOG */}

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
      >

        <DialogTitle>
          Create Manager
        </DialogTitle>


        <DialogContent
          sx={{
            display: "grid",
            gap: 2,
            mt: 1,
          }}
        >

          <TextField
            label="Name"
            fullWidth
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value,
              })
            }
          />



          <TextField
            label="Email"
            fullWidth
            value={form.email}
            onChange={(e) =>
              setForm({
                ...form,
                email: e.target.value,
              })
            }
          />



          <TextField
            label="Password"
            type="password"
            fullWidth
            value={form.password}
            onChange={(e) =>
              setForm({
                ...form,
                password: e.target.value,
              })
            }
          />



          <TextField
            select
            label="Assign Warehouse"
            fullWidth
            value={form.warehouse_id}
            onChange={(e) =>
              setForm({
                ...form,
                warehouse_id: e.target.value,
              })
            }
          >

            <MenuItem value="">
              None
            </MenuItem>


            {warehouses.map((warehouse) => (

              <MenuItem
                key={warehouse.id}
                value={warehouse.id}
              >
                {warehouse.name}
              </MenuItem>

            ))}


          </TextField>


        </DialogContent>
                <DialogActions sx={{ p: 2 }}>

          <Button
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>


          <Button
            variant="contained"
            onClick={handleCreate}
          >
            Save
          </Button>

        </DialogActions>

      </Dialog>




      {/* DELETE CONFIRMATION DIALOG */}

      <Dialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
      >

        <DialogTitle>
          Delete Manager?
        </DialogTitle>


        <DialogContent>

          <Typography>
            Are you sure you want to delete{" "}
            <b>
              {deleteTarget?.name}
            </b>
            ?
          </Typography>

        </DialogContent>


        <DialogActions>

          <Button
            onClick={() =>
              setDeleteTarget(null)
            }
          >
            Cancel
          </Button>


          <Button
            color="error"
            variant="contained"
            startIcon={<DeleteIcon />}
            onClick={handleDelete}
          >
            Delete
          </Button>


        </DialogActions>

      </Dialog>


    </Box>
  );
}
