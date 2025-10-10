# Terraform Deployment Guide — EC2 + API Gateway + Lambdas

This README shows how to:
- Download and install Terraform (with links)
- Verify Terraform is installed
- Change to the Terraform project directory
- Fill required variables
- Run `terraform init`, `terraform plan`, and `terraform apply`

---

## 1) Install Terraform

Install docs: https://developer.hashicorp.com/terraform/install  
Direct downloads: https://developer.hashicorp.com/terraform/downloads

### Windows (Chocolatey) — PowerShell as Administrator
```powershell
choco install terraform -y
terraform -version
```

### Windows (Scoop) — PowerShell (non-admin ok)
```powershell
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser -Force
iwr -useb get.scoop.sh | iex
scoop install terraform
terraform -version
```

### macOS (Homebrew) — Terminal
```bash
brew tap hashicorp/tap
brew install hashicorp/tap/terraform
terraform -version
```

### Linux (generic binary) — Shell
```bash
# Get the latest URL from: https://developer.hashicorp.com/terraform/downloads
# Example (replace <VERSION> with an actual version, e.g. 1.9.6):
wget https://releases.hashicorp.com/terraform/<VERSION>/terraform_<VERSION>_linux_amd64.zip

unzip terraform_*_linux_amd64.zip
chmod +x terraform
sudo mv terraform /usr/local/bin/
terraform -version
```

Tip: make sure the AWS CLI is installed and configured:
- Install: https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html
- Configure credentials: `aws configure`

---

## 2) Change to the Terraform directory
```bash
cd terraform
```

---

## 3) Fill variables

Create a file named `terraform.tfvars` next to your `.tf` files:

```hcl
# terraform.tfvars
region        = "ap-south-1"        # change to your AWS region
mongodb_uri   = "YOUR_MONGODB_URI"  # required by the Lambda functions
backend_host  = ""                  # leave empty to auto-use EC2 public DNS/IP
backend_port  = 80                  # set 8000 if your app listens on 8000
```

(You can also pass variables with flags like `-var region=ap-south-1`, but a tfvars file is simpler.)

---

## 4) Initialize, plan, and apply

```bash
terraform init
terraform plan
terraform apply
```

Review the plan and type `yes` when prompted.  
You can skip the prompt with `terraform apply -auto-approve` if you understand the changes.

---

## 5) Verify deployment

Show outputs at any time:
```bash
terraform output
```

Common outputs in this project (if defined in your Terraform code):
- `ssh_command` — SSH command to log in to the EC2 instance
- `api_base_url` — base URL for the HTTP API (API Gateway)
- `test_root` — curl command to hit the API base (should proxy to EC2)
- `test_verification` — curl POST to verification Lambda
- `test_issuance` — curl POST to issuance Lambda

Example usage:
```bash
# SSH into EC2 (Ubuntu AMI usually uses 'ubuntu'; Amazon Linux uses 'ec2-user')
$(terraform output -raw ssh_command)

# Hit API base (should show same content as EC2 root '/')
$(terraform output -raw test_root)

# Hit Lambda routes
$(terraform output -raw test_verification)
$(terraform output -raw test_issuance)
```

If your shell doesn’t support `-raw`, run `terraform output` and copy values manually.

---

## 6) Troubleshooting

- Invalid count argument during plan  
  Remove any `count` based on values only known at apply time (like EC2 public IP). Always create the API proxy integration instead.

- API Gateway returns 502/403  
  Ensure the app listens on `backend_port`, the security group allows that port, and (if using Nginx vhosts) the integration sets the Host header to your backend host.

- SSH permission denied (publickey)  
  Use the correct username for your AMI, ensure the instance was created with the right `key_name`, and set key permissions to `chmod 600 ~/.ssh/tfkey.pem`.

---

## 7) Destroy (clean up)
```bash
terraform destroy
```
Type `yes` to remove all resources.

## Assumptions
- **Shared persistence**: Both services read/write the same SQLite database file mounted via a ReadWriteMany PVC. ...
...
- Name: <YOUR NAME>
- Email: <YOUR EMAIL>
- Phone: <YOUR CONTACT NUMBER>
