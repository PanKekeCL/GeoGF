//<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M200-440v-80h560v80H200Z"/></svg>
const RemoveIcon = ({ color = "currentColor", size = 24 }) => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 -960 960 960" 
      fill={color} 
      width={size} 
      height={size}
    >
      <path d="M200-440v-80h560v80H200Z" />
    </svg>
  );
  
  export default RemoveIcon;