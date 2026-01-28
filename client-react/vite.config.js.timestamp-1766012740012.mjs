// vite.config.js
import { defineConfig } from "file:///C:/Users/EliteBook/Devops-Project/client-react/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/EliteBook/Devops-Project/client-react/node_modules/@vitejs/plugin-react-swc/index.mjs";
import dns from "dns";
dns.setDefaultResultOrder("verbatim");
var vite_config_default = defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api/golang": {
        target: "http://localhost:8080",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/golang/, ""),
        secure: false
      },
      "/api/node": {
        target: "http://localhost:3000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/node/, ""),
        secure: false
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxFbGl0ZUJvb2tcXFxcRGV2b3BzLVByb2plY3RcXFxcY2xpZW50LXJlYWN0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxFbGl0ZUJvb2tcXFxcRGV2b3BzLVByb2plY3RcXFxcY2xpZW50LXJlYWN0XFxcXHZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9FbGl0ZUJvb2svRGV2b3BzLVByb2plY3QvY2xpZW50LXJlYWN0L3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XHJcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdC1zd2MnO1xyXG5pbXBvcnQgZG5zIGZyb20gJ2Rucyc7XHJcblxyXG5kbnMuc2V0RGVmYXVsdFJlc3VsdE9yZGVyKCd2ZXJiYXRpbScpO1xyXG5cclxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICBwbHVnaW5zOiBbcmVhY3QoKV0sXHJcbiAgc2VydmVyOiB7XHJcbiAgICBwcm94eToge1xyXG4gICAgICAnL2FwaS9nb2xhbmcnOiB7XHJcbiAgICAgICAgdGFyZ2V0OiAnaHR0cDovL2xvY2FsaG9zdDo4MDgwJyxcclxuICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXHJcbiAgICAgICAgcmV3cml0ZTogKHBhdGgpID0+IHBhdGgucmVwbGFjZSgvXlxcL2FwaVxcL2dvbGFuZy8sICcnKSxcclxuICAgICAgICBzZWN1cmU6IGZhbHNlLFxyXG4gICAgICB9LFxyXG4gICAgICAnL2FwaS9ub2RlJzoge1xyXG4gICAgICAgIHRhcmdldDogJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwMCcsXHJcbiAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxyXG4gICAgICAgIHJld3JpdGU6IChwYXRoKSA9PiBwYXRoLnJlcGxhY2UoL15cXC9hcGlcXC9ub2RlLywgJycpLFxyXG4gICAgICAgIHNlY3VyZTogZmFsc2UsXHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gIH0sXHJcbn0pO1xyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXNVLFNBQVMsb0JBQW9CO0FBQ25XLE9BQU8sV0FBVztBQUNsQixPQUFPLFNBQVM7QUFFaEIsSUFBSSxzQkFBc0IsVUFBVTtBQUdwQyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTLENBQUMsTUFBTSxDQUFDO0FBQUEsRUFDakIsUUFBUTtBQUFBLElBQ04sT0FBTztBQUFBLE1BQ0wsZUFBZTtBQUFBLFFBQ2IsUUFBUTtBQUFBLFFBQ1IsY0FBYztBQUFBLFFBQ2QsU0FBUyxDQUFDLFNBQVMsS0FBSyxRQUFRLGtCQUFrQixFQUFFO0FBQUEsUUFDcEQsUUFBUTtBQUFBLE1BQ1Y7QUFBQSxNQUNBLGFBQWE7QUFBQSxRQUNYLFFBQVE7QUFBQSxRQUNSLGNBQWM7QUFBQSxRQUNkLFNBQVMsQ0FBQyxTQUFTLEtBQUssUUFBUSxnQkFBZ0IsRUFBRTtBQUFBLFFBQ2xELFFBQVE7QUFBQSxNQUNWO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
