var Promise = require("bluebird"),
    GitHubApi = require("github"),
    fs = Promise.promisifyAll(require("fs"));
chalk = require("chalk");

var GH_TOKEN = process.env.GITHUB_TOKEN;

if (GH_TOKEN === undefined) {
    console.error(
        "\nPlease store a GitHub token with the 'public_repo' permission in a `GITHUB_TOKEN` environment variable.\n\nYou can do so here: https://github.com/settings/tokens"
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
    .catch(function() {
        console.error(
            "It seems like you don't have an `elm-package.json` in this folder, or won't let me read it for some reason.\n\nPlease run this from inside an Elm project :)"
        );

        process.exit(1);
    })
    .then(function(data) {
        var packageData = JSON.parse(data);
        return Object.keys(packageData.dependencies || {}).map(function(
            dependency
        ) {
            var parts = dependency.split("/");
            return { owner: parts[0], repo: parts[1] };
        });
    })
    .catch(function() {
        console.error(
            "Are you sure that your `elm-package.json` is a valid JSON file?"
        );

        process.exit(1);
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
                    "🌟  " +
                        chalk.blue("Thanks") +
                        " to " +
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
    .catch(function() {
        console.error(
            "\nAww, I failed to connect to github. Are you sure you have a network connection and a valid token with `public_repo`?"
        );

        process.exit(1);
    })
    .then(function() {
        console.log("\nAll done, thanks for being grateful! 💖\n");
    });
