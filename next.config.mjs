/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config) => {
      // Enable handling of PDF files
      config.module.rules.push({
        test: /\.pdf$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]',
            },
          },
        ],
      });
      return config;
    },
  };
  
  export default nextConfig;
