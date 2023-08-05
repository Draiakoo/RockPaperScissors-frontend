const actionListNames = [
    {action: "Create game", href: "/create-game"},
    {action: "Game information", href: "/view-information-searcher"},
]

const listsNames = [
    {action: "My game log", href: "/game-log"},
    {action: "Joinable game list", href: "/join-game-list"},
    {action: "Cancelable game list", href: "/cancel-game-list"},
    {action: "Closable game list", href: "/closable-game-list"}
]

const choices = ["Not chosen", "Rock", "Paper", "Scissors"]

module.exports = {
    actionListNames,
    listsNames,
    choices
}