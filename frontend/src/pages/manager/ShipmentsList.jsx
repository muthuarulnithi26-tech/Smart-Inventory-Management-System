import { useEffect, useState } from "react";

import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  CircularProgress,
} from "@mui/material";


import {
  getShipments,
  updateShipmentStatus,
} from "../../api/shipment.api";


export default function ShipmentsList() {


  const [shipments, setShipments] = useState([]);

  const [loading, setLoading] = useState(true);



  useEffect(() => {

    loadShipments();

  }, []);




  const loadShipments = async () => {

    try {

      setLoading(true);


      const data = await getShipments();


      setShipments(
        Array.isArray(data)
          ? data
          : []
      );


    } catch (err) {

      console.log(
        "Shipment load error:",
        err
      );


      setShipments([]);


    } finally {

      setLoading(false);

    }

  };





  const handleStatusUpdate = async (
    id,
    status
  ) => {

    try {

      await updateShipmentStatus(
        id,
        status
      );


      await loadShipments();


    } catch (err) {

      console.log(
        "Shipment update error:",
        err
      );


      alert(
        "Failed to update shipment"
      );

    }

  };





  const total = shipments.length;


  const inTransit =
    shipments.filter(
      (s) =>
        s.status === "IN_TRANSIT"
    ).length;


  const delivered =
    shipments.filter(
      (s) =>
        s.status === "DELIVERED"
    ).length;





  if (loading) {

    return (

      <Box
        sx={{
          height:"60vh",
          display:"flex",
          alignItems:"center",
          justifyContent:"center",
        }}
      >

        <CircularProgress />

      </Box>

    );

  }





  return (

    <Box sx={{width:"100%"}}>


      {/* HEADER */}

      <Box sx={{mb:3}}>


        <Typography
          variant="h5"
          fontWeight={800}
        >

          Shipments

        </Typography>



        <Typography
          variant="body2"
          color="text.secondary"
        >

          Manage dispatch and delivery tracking

        </Typography>


      </Box>





      {/* KPI CARDS */}


      <Grid
        container
        spacing={3}
        sx={{mb:3}}
      >



        <Grid
          item
          xs={12}
          md={4}
        >

          <Card
            sx={{
              borderRadius:3
            }}
          >

            <CardContent>

              <Typography color="text.secondary">

                Total Shipments

              </Typography>


              <Typography
                variant="h5"
                fontWeight={800}
              >

                {total}

              </Typography>


            </CardContent>


          </Card>


        </Grid>





        <Grid
          item
          xs={12}
          md={4}
        >

          <Card
            sx={{
              borderRadius:3
            }}
          >

            <CardContent>


              <Typography color="text.secondary">

                In Transit

              </Typography>



              <Typography
                variant="h5"
                fontWeight={800}
                color="info.main"
              >

                {inTransit}

              </Typography>


            </CardContent>


          </Card>


        </Grid>





        <Grid
          item
          xs={12}
          md={4}
        >

          <Card
            sx={{
              borderRadius:3
            }}
          >

            <CardContent>


              <Typography color="text.secondary">

                Delivered

              </Typography>



              <Typography
                variant="h5"
                fontWeight={800}
                color="success.main"
              >

                {delivered}

              </Typography>


            </CardContent>


          </Card>


        </Grid>



      </Grid>
            {/* SHIPMENT TABLE */}


      <Box
        sx={{
          mt:2,
          overflowX:"auto"
        }}
      >


        {/* TABLE HEADER */}


        <Box

          sx={{

            display:"grid",

            gridTemplateColumns:
              "1fr 1fr 1fr 1fr 1fr",

            fontWeight:800,

            p:2,

            bgcolor:"#f1f5f9",

            borderRadius:2,

            minWidth:800,

          }}

        >

          <Box>
            ID
          </Box>


          <Box>
            Order
          </Box>


          <Box>
            Vehicle
          </Box>


          <Box>
            Driver
          </Box>


          <Box>
            Status
          </Box>


        </Box>





        {/* TABLE ROWS */}



        {shipments.map((s)=>(


          <Box

            key={s.id}

            sx={{

              display:"grid",

              gridTemplateColumns:
                "1fr 1fr 1fr 1fr 1fr",

              p:2,

              borderBottom:
                "1px solid #e2e8f0",

              alignItems:"center",

              minWidth:800,


              "&:hover":{

                bgcolor:"#f8fafc"

              }

            }}

          >



            {/* ID */}

            <Box
              sx={{
                fontWeight:700
              }}
            >

              #{s.id}

            </Box>





            {/* ORDER */}

            <Box>

              {s.order_id}

            </Box>





            {/* VEHICLE */}

            <Box>

              {s.vehicle_type}
              {" - "}
              {s.vehicle_number}

            </Box>





            {/* DRIVER */}

            <Box>

              {s.driver_name}

            </Box>





            {/* STATUS + ACTION */}


            <Box>


              <Chip

                size="small"

                label={s.status}


                color={

                  s.status === "PENDING"

                    ? "warning"

                    : s.status === "IN_TRANSIT"

                    ? "info"

                    : "success"

                }

              />





              {/* DISPATCH */}

              {s.status === "PENDING" && (

                <Button

                  size="small"

                  sx={{
                    ml:1
                  }}


                  onClick={()=>


                    handleStatusUpdate(

                      s.id,

                      "IN_TRANSIT"

                    )


                  }

                >

                  Dispatch

                </Button>


              )}






              {/* DELIVER */}


              {s.status === "IN_TRANSIT" && (

                <Button

                  size="small"

                  color="success"


                  sx={{
                    ml:1
                  }}


                  onClick={()=>


                    handleStatusUpdate(

                      s.id,

                      "DELIVERED"

                    )


                  }

                >

                  Done

                </Button>


              )}



            </Box>



          </Box>


        ))}



      </Box>






      {/* EMPTY STATE */}



      {!shipments.length && (

        <Box

          sx={{

            textAlign:"center",

            mt:6

          }}

        >


          <Typography
            color="text.secondary"
          >

            No shipments found

          </Typography>


        </Box>


      )}




    </Box>

  );

}
