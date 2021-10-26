# To contribute to the project

Here are the steps you will need to follow to make your contributions.

<img align="right" width="300" src="https://github.com/decoding-apocalypse/aashroy-client/blob/master/public/img/master-branch_ss.png" alt="fork this repo" />

If you don't have git on your machine, [install it.](https://git-scm.com)

## Fork this repository

Fork this repository by clicking on the fork button on the top of this page. This will create a copy of this repository in your account. Also you'll need to fork the [aashroy-client repository](https://github.com/decoding-apocalypse/aashroy-client.git)

## Now clone the forked repository

<img align="right" width="300" src="https://github.com/decoding-apocalypse/aashroy-client/blob/master/public/img/github-link.png" alt="clone the repo" />

Now clone the forked repository to your machine. Go to your GitHub account, open the forked repository, click on the code button and then click the _copy to clipboard_ icon.

Open a terminal and run the following git command:

```bash
$ git clone <url you just copied>
```

For example,

```bash
$ git clone https://github.com/decoding-apocalypse/aashroy-client.git
```

## Create a branch

Change to the repository directory on your computer by,
```bash
$ cd aashroy-client
```

```bash
#Create a branch using git checkout command
$ git checkout -b your-branch-name
```

## Make necessary changes and commit those changes

After doing the required changes in the code, when you execute `$ git status` you'll see that there are some changes.

Add those changes to the branch you have just created using,

```bash
$ git add .
```

Now commit those changes with a meaningful message,

```bash
$ git commit -m "commit message"
```

## Push changes into GitHub

```bash
$ git push origin your-branch-name
```

## Submit your changes for review

If you go to your repository on GitHub, you'll see a `Compare & pull request` button. Click on that button.

<img style="float:right;" src="https://github.com/decoding-apocalypse/aashroy-client/blob/master/public/img/create_pull_req.jpeg" alt="create a pull request" />

Now submit the pull request.

<img style="float: right;" src="https://github.com/decoding-apocalypse/aashroy-client/blob/master/public/img/create_pull_req.jpeg" alt="send pull request" />

Soon I'll review your code and merge your changes. So you will be considered as a contributor!