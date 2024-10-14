import withMT from "@material-tailwind/react/utils/withMT";
 
export default withMT({
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      colors: {
        pixelf: "#7f35f8",
        pixele: "#ff0cf5",
      },
    },
  },
});