var Promise = require("bluebird"),
    GitHubApi = require("github"),
    fs = Promise.promisifyAll(require("fs"));
chalk = require("chalk");

var GH_TOKEN = process.env.GITHUB_TOKEN;

if (GH_TOKEN === undefined) {
    console.error(
        "Please store a GitHub token with the 'public_repo' permission in a `GITHUB_TOKEN` environment variable.\n\nhttps://github.com/settings/tokens"
    );
    process.exit(1);
}

var github = new GitHubApi();
github.authenticate({
    type: "token",
    token: GH_TOKEN
});

fs
    .readFileAsync("elm-package.json")
    .then(function(data) {
        var packageData = JSON.parse(data);
        return Object.keys(packageData.dependencies || {}).map(function(
            dependency
        ) {
            var parts = dependency.split("/");
            return { owner: parts[0], repo: parts[1] };
        });
    })
    .then(function(dependencies) {
        console.log(
            "Saying thanks to everyone who helped create and maintain your Elm project's dependencies...\n"
        );
        return dependencies;
    })
    .then(function(dependencies) {
        return Promise.all(
            dependencies.map(function(dependency) {
                console.log(
                    "🌟 Thanks to " +
                        chalk.blue.bold(dependency.owner) +
                        " for " +
                        chalk.blue.bold(
                            dependency.owner + "/" + dependency.repo
                        ) +
                        "!"
                );
                return github.activity.starRepo(dependency);
            })
        );
    })
    .then(function() {
        console.log("\nAll done, thanks for being grateful! 💖\n");
    })
    .catch(function(e) {
        console.error(
            "Ohnoes! Something went wrong. Here's a weird stack trace:\n\n",
            e
        );
        process.exit(1);
    });
