import { useEffect, useMemo, useState } from "react";

import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  IconButton,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import WarehouseIcon from "@mui/icons-material/Warehouse";

import PageHeader from "../../../components/common/PageHeader";
import SearchBar from "../../../components/common/SearchBar";
import FilterSelect from "../../../components/common/FilterSelect";
import DataTable from "../../../components/common/DataTable";

import useDebouncedValue from "../../../hooks/useDebouncedValue";

import { useNotify } from "../../../context/NotificationContext";
import { useConfirm } from "../../../context/ConfirmContext";

import {
  getWarehouses,
  createWarehouse,
  updateWarehouse,
  deleteWarehouse,
} from "../../../api/warehouse.api";


// FILTER OPTIONS

const CAPACITY_FILTERS = [
  {
    value: "all",
    label: "All Capacities",
  },
  {
    value: "low",
    label: "Low (< 500)",
  },
  {
    value: "medium",
    label: "Medium (500 - 2000)",
  },
  {
    value: "high",
    label: "High (> 2000)",
  },
];


const EMPTY_FORM = {
  name: "",
  location: "",
  capacity: "",
};



export default function Warehouses() {

  const notify = useNotify();
  const confirm = useConfirm();


  // DATA STATES

  const [warehouses, setWarehouses] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);



  // DIALOG STATES

  const [open, setOpen] = useState(false);

  const [editId, setEditId] = useState(null);

  const [saving, setSaving] = useState(false);



  // SEARCH + FILTER

  const [search, setSearch] = useState("");

  const debouncedSearch = useDebouncedValue(
    search,
    250
  );


  const [capacityFilter, setCapacityFilter] = useState("all");



  // FORM STATES

  const [form, setForm] = useState(
    EMPTY_FORM
  );


  const [formErrors, setFormErrors] = useState({});



  // LOAD WAREHOUSES

  const load = async () => {

    try {

      setLoading(true);

      setError(null);


      const res = await getWarehouses();


      setWarehouses(
        Array.isArray(res)
          ? res
          : []
      );


    } catch (err) {

      console.log(err);


      setError(
        err.response?.data?.message ||
        "Failed to load warehouses"
      );


      setWarehouses([]);


    } finally {

      setLoading(false);

    }

  };



  useEffect(() => {

    load();

  }, []);




  // SEARCH + FILTER LOGIC

  const filtered = useMemo(() => {

    const q = debouncedSearch
      .toLowerCase()
      .trim();



    return warehouses.filter((w) => {


      const matchesSearch =
        !q ||
        `${w.name} ${w.location} ${w.capacity}`
          .toLowerCase()
          .includes(q);



      const cap =
        Number(w.capacity) || 0;



      const matchesCapacity =
        capacityFilter === "all" ||

        (
          capacityFilter === "low" &&
          cap < 500
        ) ||

        (
          capacityFilter === "medium" &&
          cap >= 500 &&
          cap <= 2000
        ) ||

        (
          capacityFilter === "high" &&
          cap > 2000
        );



      return (
        matchesSearch &&
        matchesCapacity
      );

    });


  }, [
    warehouses,
    debouncedSearch,
    capacityFilter,
  ]);
    // RESET FORM

  const resetForm = () => {

    setForm(EMPTY_FORM);

    setFormErrors({});

    setEditId(null);

  };



  // OPEN ADD DIALOG

  const openAddDialog = () => {

    resetForm();

    setOpen(true);

  };



  // OPEN EDIT DIALOG

  const openEditDialog = (warehouse) => {

    setEditId(warehouse.id);


    setForm({

      name: warehouse.name,

      location: warehouse.location,

      capacity: String(
        warehouse.capacity ?? ""
      ),

    });


    setFormErrors({});

    setOpen(true);

  };




  // VALIDATION

  const validate = () => {

    const errors = {};



    if (!form.name.trim()) {

      errors.name = "Name is required";

    }



    if (!form.location.trim()) {

      errors.location = "Location is required";

    }



    if (
      !form.capacity ||
      Number(form.capacity) <= 0
    ) {

      errors.capacity =
        "Enter capacity greater than 0";

    }



    setFormErrors(errors);



    return (
      Object.keys(errors).length === 0
    );

  };




  // SAVE WAREHOUSE

  const handleSave = async () => {


    if (!validate()) {

      return;

    }



    const payload = {

      ...form,

      capacity: Number(form.capacity),

    };



    try {


      setSaving(true);



      if (editId) {


        await updateWarehouse(
          editId,
          payload
        );


        notify.success(
          "Warehouse updated successfully"
        );


      } else {


        await createWarehouse(
          payload
        );


        notify.success(
          "Warehouse created successfully"
        );


      }



      setOpen(false);

      resetForm();

      load();



    } catch (err) {


      console.log(err);


      notify.fromError(
        err,
        "Failed to save warehouse"
      );


    } finally {


      setSaving(false);


    }

  };





  // DELETE WAREHOUSE

  const handleDelete = async (warehouse) => {


    const ok = await confirm({

      title: "Delete warehouse?",


      message:
        `"${warehouse.name}" will be permanently removed.`,


      confirmText: "Delete",


      danger: true,


      onConfirm: async () => {

        await deleteWarehouse(
          warehouse.id
        );

      },


    });



    if (!ok) {

      return;

    }



    notify.success(
      "Warehouse deleted"
    );


    load();


  };






  // TABLE COLUMNS

  const columns = [

    {

      field: "name",

      label: "Name",


      render: (warehouse) => (

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >

          <WarehouseIcon
            fontSize="small"
            color="action"
          />

          {warehouse.name}

        </Box>

      ),

    },



    {

      field: "location",

      label: "Location",

    },



    {

      field: "capacity",

      label: "Capacity",


      render: (warehouse) => (

        <Chip

          label={
            warehouse.capacity
          }

          size="small"

          color="primary"

        />

      ),

    },



    {

      field: "actions",

      label: "Actions",

      align: "right",


      render: (warehouse) => (

        <>

          <IconButton

            size="small"

            onClick={() =>
              openEditDialog(
                warehouse
              )
            }

          >

            <EditIcon
              fontSize="small"
            />

          </IconButton>




          <IconButton

            size="small"

            color="error"

            onClick={() =>
              handleDelete(
                warehouse
              )
            }

          >

            <DeleteIcon
              fontSize="small"
            />

          </IconButton>


        </>

      ),

    },

  ];
    return (

    <Box sx={{ width: "100%" }}>


      {/* PAGE HEADER */}

      <PageHeader

        title="Warehouse Management"

        subtitle="Manage storage locations and capacity"

        actionLabel="Add Warehouse"

        actionIcon={<AddIcon />}

        onAction={openAddDialog}

        breadcrumbs={[
          {
            label: "Admin",
            to: "/admin",
          },
          {
            label: "Warehouses",
          },
        ]}

      />




      {/* KPI CARDS */}

      <Box

        sx={{

          display: "flex",

          gap: 2,

          mb: 3,

          flexWrap: "wrap",

        }}

      >


        <Card

          sx={{

            minWidth: 180,

            flex: "1 1 180px",

          }}

        >

          <CardContent>

            <Typography

              color="text.secondary"

              variant="body2"

            >

              Total Warehouses

            </Typography>


            <Typography

              variant="h5"

              fontWeight={800}

            >

              {
                warehouses.length
              }

            </Typography>


          </CardContent>

        </Card>





        <Card

          sx={{

            minWidth: 180,

            flex: "1 1 180px",

          }}

        >

          <CardContent>


            <Typography

              color="text.secondary"

              variant="body2"

            >

              Total Capacity

            </Typography>



            <Typography

              variant="h5"

              fontWeight={800}

            >

              {
                warehouses.reduce(
                  (total, item) =>
                    total +
                    (
                      Number(
                        item.capacity
                      ) || 0
                    ),

                  0
                )
              }


            </Typography>


          </CardContent>


        </Card>



      </Box>






      {/* SEARCH + FILTER */}

      <Box

        sx={{

          display: "flex",

          gap: 2,

          mb: 2.5,

          flexWrap: "wrap",

        }}

      >


        <SearchBar


          value={search}


          onChange={setSearch}


          placeholder=
            "Search by name, location, or capacity..."


        />




        <FilterSelect


          label="Capacity"


          value={capacityFilter}


          onChange={setCapacityFilter}


          options={CAPACITY_FILTERS}


        />


      </Box>






      {/* DATA TABLE */}

      <DataTable


        columns={columns}


        rows={filtered}


        loading={loading}


        error={error}


        onRetry={load}


        emptyText={

          search ||
          capacityFilter !== "all"

            ?

            "No warehouses match your search or filter"

            :

            "No warehouses yet"

        }


        emptyActionLabel={

          !search &&
          capacityFilter === "all"

            ?

            "Add Warehouse"

            :

            undefined

        }


        onEmptyAction={
          openAddDialog
        }


      />
            {/* ADD / EDIT DIALOG */}

      <Dialog

        open={open}

        onClose={() =>
          !saving &&
          setOpen(false)
        }

        fullWidth

        maxWidth="sm"

      >


        <DialogTitle>

          {
            editId
              ? "Edit Warehouse"
              : "Add Warehouse"
          }

        </DialogTitle>




        <DialogContent

          sx={{

            display: "grid",

            gap: 2.5,

            mt: 1,

          }}

        >


          <TextField


            label="Name"


            value={form.name}


            onChange={(e) =>

              setForm({

                ...form,

                name: e.target.value,

              })

            }


            error={
              Boolean(
                formErrors.name
              )
            }


            helperText={
              formErrors.name
            }


            disabled={saving}


            fullWidth


            autoFocus


          />





          <TextField


            label="Location"


            value={form.location}


            onChange={(e) =>

              setForm({

                ...form,

                location:
                  e.target.value,

              })

            }


            error={
              Boolean(
                formErrors.location
              )
            }


            helperText={
              formErrors.location
            }


            disabled={saving}


            fullWidth


          />





          <TextField


            label="Capacity"


            type="number"


            value={form.capacity}


            onChange={(e) =>

              setForm({

                ...form,

                capacity:
                  e.target.value,

              })

            }


            error={
              Boolean(
                formErrors.capacity
              )
            }


            helperText={
              formErrors.capacity
            }


            disabled={saving}


            fullWidth


          />



        </DialogContent>





        <DialogActions

          sx={{

            px: 3,

            pb: 2.5,

          }}

        >


          <Button


            onClick={() =>
              setOpen(false)
            }


            disabled={saving}


          >

            Cancel


          </Button>





          <Button


            variant="contained"


            onClick={handleSave}


            disabled={saving}


          >

            {
              saving
                ? "Saving..."
                : "Save"
            }


          </Button>


        </DialogActions>



      </Dialog>



    </Box>

  );

}
