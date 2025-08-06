/**
 * Webpack Configuration Overrides
 * 
 * Optimizations for production build
 */

const path = require('path');
const webpack = require('webpack');
const CompressionPlugin = require('compression-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = function override(config, env) {
  // Production optimizations
  if (env === 'production') {
    // Enable gzip compression
    config.plugins.push(
      new CompressionPlugin({
        algorithm: 'gzip',
        test: /\.(js|css|html|svg)$/,
        threshold: 8192,
        minRatio: 0.8
      })
    );

    // Optimize JS minification
    config.optimization.minimizer = [
      new TerserPlugin({
        terserOptions: {
          parse: {
            ecma: 8,
          },
          compress: {
            ecma: 5,
            warnings: false,
            comparisons: false,
            inline: 2,
            drop_console: true,
            drop_debugger: true
          },
          mangle: {
            safari10: true,
          },
          output: {
            ecma: 5,
            comments: false,
            ascii_only: true,
          },
        },
        parallel: true,
      }),
    ];

    // Split chunks for better caching
    config.optimization.splitChunks = {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: 10,
          reuseExistingChunk: true,
        },
        common: {
          minChunks: 2,
          priority: 5,
          reuseExistingChunk: true,
        },
        // Separate large libraries
        react: {
          test: /[\\/]node_modules[\\/](react|react-dom|react-router)[\\/]/,
          name: 'react',
          priority: 20,
        },
        markdown: {
          test: /[\\/]node_modules[\\/](react-markdown|remark|rehype)[\\/]/,
          name: 'markdown',
          priority: 15,
        },
      },
    };

    // Enable module concatenation
    config.optimization.concatenateModules = true;

    // Add bundle analyzer in analyze mode
    if (process.env.ANALYZE) {
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          reportFilename: 'bundle-report.html',
          openAnalyzer: false,
        })
      );
    }
  }

  // Configure module resolution
  config.resolve.alias = {
    ...config.resolve.alias,
    '@components': path.resolve(__dirname, 'src/components'),
    '@services': path.resolve(__dirname, 'src/services'),
    '@hooks': path.resolve(__dirname, 'src/hooks'),
    '@utils': path.resolve(__dirname, 'src/utils'),
    '@contexts': path.resolve(__dirname, 'src/contexts'),
  };

  // Add Node.js polyfills for browser compatibility
  config.resolve.fallback = {
    ...config.resolve.fallback,
    "crypto": require.resolve("crypto-browserify"),
    "stream": require.resolve("stream-browserify"),
    "buffer": require.resolve("buffer"),
    "process": require.resolve("process"),
    "util": require.resolve("util"),
    "vm": false,
    "fs": false,
    "net": false,
    "tls": false,
    "http": false,
    "https": false,
    "os": false,
    "path": false,
  };

  // Add webpack plugins for global variables
  config.plugins.push(
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process',
    })
  );

  // Optimize image loading
  const imageRule = config.module.rules.find(rule => 
    rule.oneOf && rule.oneOf.find(r => r.test && r.test.toString().includes('png|jpg'))
  );
  
  if (imageRule && imageRule.oneOf) {
    imageRule.oneOf.unshift({
      test: /\.(png|jpe?g|gif|webp)$/,
      use: [
        {
          loader: 'image-webpack-loader',
          options: {
            mozjpeg: {
              progressive: true,
              quality: 65
            },
            optipng: {
              enabled: false,
            },
            pngquant: {
              quality: [0.65, 0.90],
              speed: 4
            },
            gifsicle: {
              interlaced: false,
            },
            webp: {
              quality: 75
            }
          }
        }
      ]
    });
  }

  return config;
};

// Helper to add to package.json scripts:
// "build:analyze": "ANALYZE=true npm run build"