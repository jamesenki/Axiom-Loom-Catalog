#!/usr/bin/env python3
"""
EYNS AI Experience Center - Comprehensive Network Accessibility Tests
This script performs detailed testing of the deployed application
Target: http://10.0.0.109
"""

import requests
import time
import json
import socket
import subprocess
import sys
from datetime import datetime
from concurrent.futures import ThreadPoolExecutor, as_completed
from urllib.parse import urlparse
import warnings
warnings.filterwarnings('ignore', category=requests.packages.urllib3.exceptions.InsecureRequestWarning)

# Configuration
BASE_URL = "http://10.0.0.109"
API_BASE_URL = "http://10.0.0.109:3001"
LOCALHOST_URL = "http://localhost"
LOCALHOST_API = "http://localhost:3001"

# ANSI color codes
class Colors:
    RED = '\033[0;31m'
    GREEN = '\033[0;32m'
    YELLOW = '\033[1;33m'
    BLUE = '\033[0;34m'
    CYAN = '\033[0;36m'
    NC = '\033[0m'  # No Color

class NetworkAccessibilityTester:
    def __init__(self):
        self.results = {
            'timestamp': datetime.now().isoformat(),
            'target': BASE_URL,
            'tests': [],
            'summary': {
                'total': 0,
                'passed': 0,
                'failed': 0,
                'warnings': 0
            }
        }
        self.session = requests.Session()
        
    def print_section(self, title):
        print(f"\n{Colors.BLUE}{'=' * 60}{Colors.NC}")
        print(f"{Colors.BLUE}{title}{Colors.NC}")
        print(f"{Colors.BLUE}{'=' * 60}{Colors.NC}\n")
        
    def print_test(self, description):
        print(f"{Colors.YELLOW}Testing: {description}{Colors.NC}")
        
    def print_success(self, message):
        print(f"{Colors.GREEN}✓ {message}{Colors.NC}")
        
    def print_error(self, message):
        print(f"{Colors.RED}✗ {message}{Colors.NC}")
        
    def print_warning(self, message):
        print(f"{Colors.CYAN}⚠ {message}{Colors.NC}")
        
    def add_result(self, test_name, status, details="", duration=0):
        result = {
            'test': test_name,
            'status': status,
            'details': details,
            'duration': duration
        }
        self.results['tests'].append(result)
        self.results['summary']['total'] += 1
        
        if status == 'PASS':
            self.results['summary']['passed'] += 1
        elif status == 'FAIL':
            self.results['summary']['failed'] += 1
        elif status == 'WARN':
            self.results['summary']['warnings'] += 1
            
    def test_endpoint(self, url, description, expected_status=200, timeout=10):
        """Test HTTP endpoint"""
        self.print_test(description)
        start_time = time.time()
        
        try:
            response = self.session.get(url, timeout=timeout)
            duration = time.time() - start_time
            
            if response.status_code == expected_status:
                self.print_success(f"Status: {response.status_code}, Time: {duration:.2f}s, Size: {len(response.content)} bytes")
                self.add_result(description, 'PASS', f"Status: {response.status_code}", duration)
                return True
            else:
                self.print_error(f"Expected {expected_status}, got {response.status_code}")
                self.add_result(description, 'FAIL', f"Expected {expected_status}, got {response.status_code}", duration)
                return False
                
        except requests.exceptions.Timeout:
            self.print_error(f"Request timed out after {timeout}s")
            self.add_result(description, 'FAIL', f"Timeout after {timeout}s", timeout)
            return False
            
        except requests.exceptions.ConnectionError as e:
            self.print_error(f"Connection error: {str(e)}")
            self.add_result(description, 'FAIL', f"Connection error: {str(e)}", 0)
            return False
            
        except Exception as e:
            self.print_error(f"Error: {str(e)}")
            self.add_result(description, 'FAIL', f"Error: {str(e)}", 0)
            return False
            
    def test_api_endpoint(self, url, description, method='GET', data=None, headers=None, expected_status=200):
        """Test API endpoint"""
        self.print_test(description)
        start_time = time.time()
        
        try:
            if method == 'GET':
                response = self.session.get(url, headers=headers)
            elif method == 'POST':
                response = self.session.post(url, json=data, headers=headers)
            elif method == 'PUT':
                response = self.session.put(url, json=data, headers=headers)
            elif method == 'DELETE':
                response = self.session.delete(url, headers=headers)
            else:
                raise ValueError(f"Unsupported method: {method}")
                
            duration = time.time() - start_time
            
            if response.status_code == expected_status:
                self.print_success(f"Status: {response.status_code}, Time: {duration:.2f}s")
                self.add_result(description, 'PASS', f"Status: {response.status_code}", duration)
                return True, response
            else:
                self.print_error(f"Expected {expected_status}, got {response.status_code}")
                self.add_result(description, 'FAIL', f"Expected {expected_status}, got {response.status_code}", duration)
                return False, response
                
        except Exception as e:
            self.print_error(f"Error: {str(e)}")
            self.add_result(description, 'FAIL', f"Error: {str(e)}", 0)
            return False, None
            
    def test_cors(self, url, origin, description):
        """Test CORS headers"""
        self.print_test(description)
        
        headers = {
            'Origin': origin,
            'Access-Control-Request-Method': 'GET'
        }
        
        try:
            response = self.session.options(url, headers=headers)
            cors_headers = {
                'Access-Control-Allow-Origin': response.headers.get('Access-Control-Allow-Origin'),
                'Access-Control-Allow-Methods': response.headers.get('Access-Control-Allow-Methods'),
                'Access-Control-Allow-Headers': response.headers.get('Access-Control-Allow-Headers')
            }
            
            if cors_headers['Access-Control-Allow-Origin']:
                self.print_success(f"CORS enabled: {cors_headers['Access-Control-Allow-Origin']}")
                self.add_result(description, 'PASS', f"CORS headers present: {cors_headers}")
                return True
            else:
                self.print_error("CORS headers missing")
                self.add_result(description, 'FAIL', "CORS headers missing")
                return False
                
        except Exception as e:
            self.print_error(f"Error: {str(e)}")
            self.add_result(description, 'FAIL', f"Error: {str(e)}")
            return False
            
    def test_performance(self, url, description, max_time=2.0):
        """Test response time performance"""
        self.print_test(description)
        
        times = []
        for i in range(3):  # Test 3 times and average
            start_time = time.time()
            try:
                response = self.session.get(url)
                duration = time.time() - start_time
                times.append(duration)
            except:
                pass
                
        if times:
            avg_time = sum(times) / len(times)
            if avg_time < max_time:
                self.print_success(f"Avg response time: {avg_time:.2f}s (threshold: {max_time}s)")
                self.add_result(description, 'PASS', f"Avg time: {avg_time:.2f}s", avg_time)
                return True
            else:
                self.print_error(f"Avg response time: {avg_time:.2f}s exceeds threshold: {max_time}s")
                self.add_result(description, 'FAIL', f"Avg time: {avg_time:.2f}s exceeds threshold", avg_time)
                return False
        else:
            self.print_error("Could not measure response time")
            self.add_result(description, 'FAIL', "Could not measure response time")
            return False
            
    def test_security_headers(self, url):
        """Test security headers"""
        self.print_test("Security headers check")
        
        try:
            response = self.session.get(url)
            headers = response.headers
            
            required_headers = [
                'X-Frame-Options',
                'X-XSS-Protection',
                'X-Content-Type-Options',
                'Referrer-Policy',
                'Permissions-Policy',
                'Content-Security-Policy'
            ]
            
            missing_headers = []
            present_headers = {}
            
            for header in required_headers:
                if header in headers:
                    self.print_success(f"{header}: {headers[header]}")
                    present_headers[header] = headers[header]
                else:
                    self.print_error(f"{header}: missing")
                    missing_headers.append(header)
                    
            if not missing_headers:
                self.add_result("Security headers", 'PASS', f"All headers present: {list(present_headers.keys())}")
            else:
                self.add_result("Security headers", 'FAIL', f"Missing headers: {missing_headers}")
                
        except Exception as e:
            self.print_error(f"Error: {str(e)}")
            self.add_result("Security headers", 'FAIL', f"Error: {str(e)}")
            
    def test_rate_limiting(self, url, requests_count=20):
        """Test rate limiting"""
        self.print_test("Rate limiting test")
        
        print(f"Making {requests_count} rapid requests...")
        rate_limited = False
        
        for i in range(requests_count):
            try:
                response = self.session.get(url)
                if response.status_code == 429:
                    rate_limited = True
                    self.print_success(f"Rate limiting triggered after {i+1} requests")
                    self.add_result("Rate limiting", 'PASS', f"Triggered after {i+1} requests")
                    break
            except:
                pass
                
        if not rate_limited:
            self.print_warning("Rate limiting might not be configured (or limit is high)")
            self.add_result("Rate limiting", 'WARN', f"Not triggered after {requests_count} requests")
            
    def test_websocket(self, ws_url):
        """Test WebSocket connectivity"""
        self.print_test("WebSocket connectivity")
        
        try:
            # Convert http to ws URL
            parsed = urlparse(ws_url)
            ws_url = f"ws://{parsed.netloc}/ws"
            
            import websocket
            ws = websocket.create_connection(ws_url, timeout=5)
            ws.close()
            
            self.print_success("WebSocket connection successful")
            self.add_result("WebSocket", 'PASS', "Connection successful")
            return True
            
        except ImportError:
            self.print_warning("websocket-client not installed, skipping WebSocket test")
            self.add_result("WebSocket", 'WARN', "websocket-client not installed")
            return False
            
        except Exception as e:
            self.print_error(f"WebSocket connection failed: {str(e)}")
            self.add_result("WebSocket", 'FAIL', f"Connection failed: {str(e)}")
            return False
            
    def test_port_accessibility(self, host, port, description):
        """Test if a specific port is accessible"""
        self.print_test(description)
        
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(5)
        
        try:
            result = sock.connect_ex((host, port))
            sock.close()
            
            if result == 0:
                self.print_success(f"Port {port} is accessible")
                self.add_result(description, 'PASS', f"Port {port} is open")
                return True
            else:
                self.print_error(f"Port {port} is not accessible")
                self.add_result(description, 'FAIL', f"Port {port} is closed")
                return False
                
        except Exception as e:
            self.print_error(f"Error: {str(e)}")
            self.add_result(description, 'FAIL', f"Error: {str(e)}")
            return False
            
    def test_concurrent_connections(self, url, concurrent_requests=10):
        """Test concurrent connections"""
        self.print_test(f"Concurrent connections test ({concurrent_requests} requests)")
        
        def make_request(url):
            try:
                start = time.time()
                response = requests.get(url, timeout=10)
                return response.status_code, time.time() - start
            except:
                return None, 0
                
        with ThreadPoolExecutor(max_workers=concurrent_requests) as executor:
            futures = [executor.submit(make_request, url) for _ in range(concurrent_requests)]
            results = []
            
            for future in as_completed(futures):
                status, duration = future.result()
                if status:
                    results.append((status, duration))
                    
        if results:
            success_count = sum(1 for status, _ in results if status == 200)
            avg_time = sum(duration for _, duration in results) / len(results)
            
            self.print_success(f"Success: {success_count}/{concurrent_requests}, Avg time: {avg_time:.2f}s")
            self.add_result("Concurrent connections", 'PASS', 
                          f"Success rate: {success_count}/{concurrent_requests}, Avg time: {avg_time:.2f}s")
        else:
            self.print_error("All concurrent requests failed")
            self.add_result("Concurrent connections", 'FAIL', "All requests failed")
            
    def run_all_tests(self):
        """Run all tests"""
        print(f"\n{Colors.CYAN}EYNS AI Experience Center - Network Accessibility Tests{Colors.NC}")
        print(f"{Colors.CYAN}Target: {BASE_URL}{Colors.NC}")
        print(f"{Colors.CYAN}Started: {datetime.now()}{Colors.NC}")
        
        # 1. Local Access Tests
        self.print_section("1. LOCAL ACCESS TESTS")
        
        self.test_endpoint(LOCALHOST_URL, "Frontend on localhost")
        self.test_endpoint(BASE_URL, "Frontend on LAN IP")
        self.test_endpoint(f"{BASE_URL}:80", "Frontend on port 80")
        self.test_endpoint(f"{LOCALHOST_API}/api/health", "API health on localhost")
        self.test_endpoint(f"{API_BASE_URL}/api/health", "API health on LAN IP")
        
        # 2. Network Connectivity Tests
        self.print_section("2. NETWORK CONNECTIVITY TESTS")
        
        # Test port accessibility
        self.test_port_accessibility("10.0.0.109", 80, "Port 80 (HTTP)")
        self.test_port_accessibility("10.0.0.109", 3001, "Port 3001 (API)")
        self.test_port_accessibility("10.0.0.109", 443, "Port 443 (HTTPS)")
        
        # Test CORS
        self.test_cors(f"{API_BASE_URL}/api/health", "http://localhost:3000", "CORS from localhost")
        self.test_cors(f"{API_BASE_URL}/api/health", BASE_URL, "CORS from LAN IP")
        self.test_cors(f"{API_BASE_URL}/api/health", "https://example.com", "CORS from external origin")
        
        # 3. API Endpoint Tests
        self.print_section("3. API ENDPOINT TESTS")
        
        # Health endpoints
        self.test_endpoint(f"{BASE_URL}/health", "Nginx health check")
        self.test_api_endpoint(f"{API_BASE_URL}/api/health", "Backend health check")
        
        # Protected endpoints (should require auth)
        self.test_api_endpoint(f"{API_BASE_URL}/api/repositories", "List repositories (no auth)", expected_status=401)
        self.test_api_endpoint(f"{API_BASE_URL}/api/repository/test", "Get repository (no auth)", expected_status=401)
        self.test_api_endpoint(f"{API_BASE_URL}/api/search", "Search endpoint (no auth)", expected_status=401)
        
        # Auth endpoints
        auth_data = {"username": "testuser", "password": "testpass123"}
        self.test_api_endpoint(f"{API_BASE_URL}/api/register", "Register endpoint", 
                             method='POST', data=auth_data, expected_status=200)
        self.test_api_endpoint(f"{API_BASE_URL}/api/login", "Login endpoint", 
                             method='POST', data=auth_data, expected_status=200)
        
        # 4. Performance Tests
        self.print_section("4. PERFORMANCE TESTS")
        
        self.test_performance(BASE_URL, "Frontend page load time", max_time=2.0)
        self.test_performance(f"{API_BASE_URL}/api/health", "API health response time", max_time=0.1)
        
        # Concurrent connections test
        self.test_concurrent_connections(f"{API_BASE_URL}/api/health", concurrent_requests=10)
        
        # 5. Security Tests
        self.print_section("5. SECURITY TESTS")
        
        self.test_security_headers(BASE_URL)
        self.test_rate_limiting(f"{API_BASE_URL}/api/health", requests_count=30)
        
        # Test authentication enforcement
        protected_endpoints = [
            "/api/repositories",
            "/api/repository/test/details",
            "/api/repository/test/apis",
            "/api/repository/test/file?path=README.md"
        ]
        
        auth_working = True
        for endpoint in protected_endpoints:
            success, response = self.test_api_endpoint(
                f"{API_BASE_URL}{endpoint}", 
                f"Protected endpoint: {endpoint}",
                expected_status=401
            )
            if not success:
                auth_working = False
                
        if auth_working:
            self.print_success("All protected endpoints require authentication")
            
        # 6. WebSocket Tests
        self.print_section("6. WEBSOCKET CONNECTIVITY")
        self.test_websocket(BASE_URL)
        
        # Generate report
        self.generate_report()
        
    def generate_report(self):
        """Generate test report"""
        self.print_section("TEST SUMMARY")
        
        summary = self.results['summary']
        print(f"Total Tests: {summary['total']}")
        print(f"{Colors.GREEN}Passed: {summary['passed']}{Colors.NC}")
        print(f"{Colors.RED}Failed: {summary['failed']}{Colors.NC}")
        print(f"{Colors.CYAN}Warnings: {summary['warnings']}{Colors.NC}")
        
        # Calculate success rate
        if summary['total'] > 0:
            success_rate = (summary['passed'] / summary['total']) * 100
            print(f"\nSuccess Rate: {success_rate:.1f}%")
            
            if success_rate == 100:
                print(f"\n{Colors.GREEN}✓ All tests passed!{Colors.NC}")
            elif success_rate >= 80:
                print(f"\n{Colors.YELLOW}⚠ Most tests passed with some issues{Colors.NC}")
            else:
                print(f"\n{Colors.RED}✗ Multiple tests failed{Colors.NC}")
                
        # Save detailed report
        report_filename = f"network-accessibility-report-{datetime.now().strftime('%Y%m%d-%H%M%S')}.json"
        with open(report_filename, 'w') as f:
            json.dump(self.results, f, indent=2)
            
        print(f"\n{Colors.GREEN}Detailed report saved to: {report_filename}{Colors.NC}")
        
        # Print failed tests
        if summary['failed'] > 0:
            print(f"\n{Colors.RED}Failed Tests:{Colors.NC}")
            for test in self.results['tests']:
                if test['status'] == 'FAIL':
                    print(f"  - {test['test']}: {test['details']}")

if __name__ == "__main__":
    tester = NetworkAccessibilityTester()
    tester.run_all_tests()