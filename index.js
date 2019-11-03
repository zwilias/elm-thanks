var Promise = require("bluebird"),
    GitHubApi = require("@octokit/rest"),
    fs = Promise.promisifyAll(require("fs")),
    chalk = require("chalk");

var GH_TOKEN = process.env.GITHUB_TOKEN;

function failWithMessage(message) {
  return function() {
    console.error(message);
    process.exit(1);
  }
}

if (GH_TOKEN === undefined) {
    failWithMessage(
        "\nPlease store a GitHub token with the 'public_repo' permission in a `GITHUB_TOKEN` environment variable.\n\nYou can configure a token here: https://github.com/settings/tokens\n"
    )();
}

var github = new GitHubApi();
github.authenticate({
    type: "token",
    token: GH_TOKEN
});

function extractDependencies(dependencies) {
    return Object
        .keys(dependencies)
        .flatMap(function(dependency) {
            // in elm 0.19+ dependencies are nested
            if (dependency === 'direct' || dependency === 'indirect') {
                return extractDependencies(dependencies[dependency]);
            }
            var parts = dependency.split("/");
            return { owner: parts[0], repo: parts[1] };
        });
}

fs
    .readFileAsync("elm-package.json")
    .catch(function() {
        return fs.readFileAsync("elm.json");
    })
    .catch(failWithMessage(
        "It seems like you don't have an `elm-package.json` or `elm.json` in this folder, or won't let me read it for some reason.\n\nPlease run this in an Elm project :)\n"
    ))
    .then(function(data) {
        var packageData = JSON.parse(data);
        var dependencies = packageData.dependencies || {};
        return extractDependencies(dependencies);
    })
    .catch(failWithMessage(
        "Are you sure that your `elm-package.json` is a valid JSON file?\n"
    ))
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
    .catch(failWithMessage(
        "\nAww, I failWithMessageed to connect to github. Are you sure you have a network connection and a valid token with `public_repo` permissions?\n"
    ))
    .then(function() {
        console.log("\nAll done, thanks for being grateful! 💖\n");
    });
