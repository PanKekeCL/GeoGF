// <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>
const AddIcon = ({ color = "currentColor", size = 24 }) => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 -960 960 960" 
      fill={color} 
      width={size} 
      height={size}
    >
      <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
    </svg>
  );
  
  export default AddIcon;