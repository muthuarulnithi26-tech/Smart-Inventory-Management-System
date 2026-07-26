import { useEffect, useRef, useState } from "react";

import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  Paper,
  Divider,
  Avatar,
} from "@mui/material";

import Inventory2Icon from "@mui/icons-material/Inventory2";
import SecurityIcon from "@mui/icons-material/Security";

import { useNavigate } from "react-router-dom";

import PasswordField from "../../components/common/PasswordField";
import { loginUser } from "../../api/auth.api";


const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


const ROLE_HOME = {
  admin: "/admin",
  manager: "/manager",
  staff: "/staff",
};


export default function Login() {

  const navigate = useNavigate();

  const emailRef = useRef(null);


  const [form, setForm] = useState({
    email: "",
    password: "",
  });


  const [fieldErrors, setFieldErrors] = useState({});

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);



  useEffect(() => {

    const token = localStorage.getItem("token");

    const role = localStorage.getItem("role");


    if (token && ROLE_HOME[role]) {

      navigate(
        ROLE_HOME[role],
        {
          replace: true,
        }
      );

    }

  }, [navigate]);



  const handleChange = (e) => {

    const {
      name,
      value,
    } = e.target;


    setForm((prev)=>({
      ...prev,
      [name]:value,
    }));


    if(fieldErrors[name]){

      setFieldErrors((prev)=>({
        ...prev,
        [name]:"",
      }));

    }


    if(error){

      setError("");

    }

  };



  const validate = () => {

    const errors = {};


    if(!form.email.trim()){

      errors.email="Email is required";

    }
    else if(!EMAIL_REGEX.test(form.email.trim())){

      errors.email="Enter valid email address";

    }



    if(!form.password){

      errors.password="Password is required";

    }


    setFieldErrors(errors);


    return Object.keys(errors).length===0;

  };
    const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");


    if (!validate()) return;



    try {

      setLoading(true);


      const res = await loginUser({

        email: form.email.trim(),

        password: form.password,

      });



      localStorage.setItem(
        "token",
        res.access_token
      );


      localStorage.setItem(
        "role",
        res.role
      );



      navigate(
        ROLE_HOME[res.role] || "/login",
        {
          replace:true,
        }
      );



    } catch (err) {


      if(!err.response){

        setError(
          "Unable to connect with server. Please check your connection."
        );


      } 
      else if(
        err.response.status === 401 ||
        err.response.status === 400
      ){

        setError(
          "Invalid email or password."
        );


      }
      else {

        setError(
          err.response?.data?.detail ||
          "Login failed. Please try again."
        );

      }


      emailRef.current?.focus();


    } finally {


      setLoading(false);


    }

  };



  return (

    <Box

      sx={{

        minHeight:"100vh",

        display:"flex",

        alignItems:"center",

        justifyContent:"center",

        background:

          "linear-gradient(135deg,#eff6ff,#f8fafc)",

        p:2,

      }}

    >


      <Paper

        elevation={6}

        sx={{

          width:"100%",

          maxWidth:450,

          borderRadius:4,

          p:{xs:3,sm:5},

        }}

      >



        {/* LOGO */}

        <Box

          sx={{

            display:"flex",

            flexDirection:"column",

            alignItems:"center",

            mb:3,

          }}

        >


          <Avatar

            sx={{

              width:70,

              height:70,

              bgcolor:"primary.main",

              mb:2,

            }}

          >

            <Inventory2Icon

              sx={{

                fontSize:40,

              }}

            />

          </Avatar>



          <Typography

            variant="h4"

            fontWeight={900}

            textAlign="center"

          >

            Smart Inventory

          </Typography>



          <Typography

            color="text.secondary"

            textAlign="center"

            sx={{mt:1}}

          >

            Management System

          </Typography>


        </Box>




        <Divider sx={{mb:3}} />



        {error && (

          <Alert

            severity="error"

            sx={{

              mb:3,

              borderRadius:2,

            }}

          >

            {error}

          </Alert>

        )}



        <Box

          component="form"

          onSubmit={handleSubmit}

          noValidate

          sx={{

            display:"flex",

            flexDirection:"column",

            gap:2.5,

          }}

        >



          <TextField

            label="Email Address"

            name="email"

            type="email"

            value={form.email}

            onChange={handleChange}

            fullWidth

            autoFocus

            inputRef={emailRef}

            autoComplete="email"

            error={Boolean(fieldErrors.email)}

            helperText={fieldErrors.email}

            disabled={loading}

          />
                    <PasswordField

            label="Password"

            name="password"

            value={form.password}

            onChange={handleChange}

            fullWidth

            autoComplete="current-password"

            error={Boolean(fieldErrors.password)}

            helperText={fieldErrors.password}

            disabled={loading}

          />



          <Button

            type="submit"

            variant="contained"

            fullWidth

            size="large"

            disabled={loading}

            sx={{

              mt:1,

              height:52,

              borderRadius:3,

              fontWeight:800,

              fontSize:"1rem",

              textTransform:"none",

            }}

          >


            {loading ? (

              <>

                <CircularProgress

                  size={22}

                  color="inherit"

                  sx={{mr:1}}

                />

                Signing In...


              </>


            ) : (

              "Sign In"

            )}



          </Button>



        </Box>




        {/* SECURITY INFO */}


        <Box

          sx={{

            mt:4,

            p:2,

            borderRadius:3,

            bgcolor:"#f8fafc",

            display:"flex",

            gap:2,

            alignItems:"center",

          }}

        >


          <SecurityIcon

            color="primary"

          />


          <Box>


            <Typography

              variant="subtitle2"

              fontWeight={700}

            >

              Secure Access

            </Typography>



            <Typography

              variant="caption"

              color="text.secondary"

            >

              JWT protected authentication with role based permissions.

            </Typography>


          </Box>


        </Box>




        {/* ROLE INFORMATION */}


        <Box

          sx={{

            mt:3,

            textAlign:"center",

          }}

        >


          <Typography

            variant="caption"

            color="text.secondary"

          >

            Admin • Manager • Staff access supported

          </Typography>


        </Box>



      </Paper>


    </Box>

  );

}
